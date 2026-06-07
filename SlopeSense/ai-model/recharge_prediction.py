import argparse
import json
import math
import numpy as np
import sys


def parse_arguments():
    parser = argparse.ArgumentParser(description='Groundwater recharge point prediction from DEM data.')
    parser.add_argument('--lat-min', type=float, required=False)
    parser.add_argument('--lon-min', type=float, required=False)
    parser.add_argument('--lat-max', type=float, required=False)
    parser.add_argument('--lon-max', type=float, required=False)
    parser.add_argument('--dem-file', type=str, default=None,
                        help='Optional CSV file containing elevation values.')
    parser.add_argument('--size', type=int, default=120,
                        help='Grid size for generated DEM when no DEM file is provided.')
    parser.add_argument('--count', type=int, default=8,
                        help='Number of recharge point candidates to return.')
    parser.add_argument('--output-json', action='store_true', help='Output JSON only.')
    return parser.parse_args()


def load_dem(args):
    if args.dem_file:
        try:
            dem = np.loadtxt(args.dem_file, delimiter=',')
            if dem.ndim != 2:
                raise ValueError('DEM file must contain a 2D array of elevation values.')
            return dem
        except Exception as ex:
            raise RuntimeError(f'Unable to load DEM file: {ex}')

    # Generate a synthetic DEM if no file is provided.
    size = args.size
    x = np.linspace(0, 1, size)
    y = np.linspace(0, 1, size)
    xx, yy = np.meshgrid(x, y)

    # Synthetic terrain made of hills, valleys, and a gentle slope.
    dem = 220 * np.exp(-5 * ((xx - 0.3)**2 + (yy - 0.5)**2))
    dem += 160 * np.exp(-18 * ((xx - 0.7)**2 + (yy - 0.8)**2))
    dem += 55 * np.sin(2 * np.pi * xx) * np.cos(2 * np.pi * yy)
    dem += 15 * xx
    dem += 3 * yy
    dem = dem.astype(np.float64)
    return dem


def compute_slope(dem, cell_size=1.0):
    dzdy, dzdx = np.gradient(dem, cell_size)
    slope = np.sqrt(dzdx**2 + dzdy**2)
    slope_degrees = np.degrees(np.arctan(slope))
    return slope_degrees


def flow_direction(dem):
    rows, cols = dem.shape
    directions = -np.ones((rows, cols, 2), dtype=int)

    neighbors = [(-1, -1), (-1, 0), (-1, 1),
                 (0, -1),           (0, 1),
                 (1, -1),  (1, 0),  (1, 1)]

    for r in range(rows):
        for c in range(cols):
            best = dem[r, c]
            best_neighbor = None
            for dr, dc in neighbors:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    if dem[nr, nc] < best:
                        best = dem[nr, nc]
                        best_neighbor = (nr, nc)
            if best_neighbor is not None:
                directions[r, c] = best_neighbor
    return directions


def flow_accumulation(dem, directions):
    rows, cols = dem.shape
    accumulation = np.ones((rows, cols), dtype=np.int32)
    cell_order = np.argsort(dem.ravel())[::-1]
    for idx in cell_order:
        r, c = divmod(idx, cols)
        nr, nc = directions[r, c]
        if nr >= 0 and nc >= 0:
            accumulation[nr, nc] += accumulation[r, c]
    return accumulation


def normalize(data):
    min_val = np.nanmin(data)
    max_val = np.nanmax(data)
    if max_val == min_val:
        return np.zeros_like(data)
    return (data - min_val) / (max_val - min_val)


def score_cells(slope, accumulation):
    norm_slope = normalize(slope)
    norm_acc = normalize(accumulation.astype(np.float64))
    score = (1.0 - norm_slope) * 0.6 + norm_acc * 0.4
    return score


def best_recharge_points(dem, slope, accumulation, count=3):
    score = score_cells(slope, accumulation)
    rows, cols = dem.shape
    flat_enough = slope <= np.percentile(slope, 50)
    candidate_score = score * flat_enough.astype(np.float64)
    flat_indices = np.argwhere(candidate_score > 0)
    if flat_indices.size == 0:
        candidate_score = score
        flat_indices = np.argwhere(score > 0)

    idx_flat = np.argsort(candidate_score.ravel())[::-1]
    selected = []
    used = set()
    for idx in idx_flat:
        r, c = divmod(idx, cols)
        if (r, c) in used:
            continue
        selected.append((r, c, slope[r, c], accumulation[r, c], float(candidate_score[r, c])))
        used.add((r, c))
        if len(selected) >= count:
            break

    return selected


def raster_to_geo(r, c, shape, lat_min, lon_min, lat_max, lon_max):
    rows, cols = shape
    lat = lat_min + (lat_max - lat_min) * (r + 0.5) / rows
    lon = lon_min + (lon_max - lon_min) * (c + 0.5) / cols
    return lat, lon


def predict_recharge(args):
    dem = load_dem(args)
    slope = compute_slope(dem)
    directions = flow_direction(dem)
    accumulation = flow_accumulation(dem, directions)
    points = best_recharge_points(dem, slope, accumulation, count=args.count)

    lat_min = args.lat_min if args.lat_min is not None else 0.0
    lon_min = args.lon_min if args.lon_min is not None else 0.0
    lat_max = args.lat_max if args.lat_max is not None else 1.0
    lon_max = args.lon_max if args.lon_max is not None else 1.0

    results = []
    for r, c, slope_val, acc_val, score_val in points:
        lat, lon = raster_to_geo(r, c, dem.shape, lat_min, lon_min, lat_max, lon_max)
        results.append({
            'latitude': float(lat),
            'longitude': float(lon),
            'row': int(r),
            'col': int(c),
            'slope_degrees': float(np.round(slope_val, 3)),
            'accumulation': int(acc_val),
            'score': float(np.round(score_val, 4)),
        })

    summary = {
        'grid_shape': dem.shape,
        'lat_min': lat_min,
        'lon_min': lon_min,
        'lat_max': lat_max,
        'lon_max': lon_max,
        'recharge_points': results,
    }
    return summary


if __name__ == '__main__':
    args = parse_arguments()
    try:
        result = predict_recharge(args)
        if args.output_json:
            print(json.dumps(result))
        else:
            print('Groundwater Recharge Prediction Results:')
            for idx, point in enumerate(result['recharge_points'], start=1):
                print(f"Point {idx}: lat={point['latitude']:.6f}, lon={point['longitude']:.6f}, "
                      f"slope={point['slope_degrees']:.2f}°, accumulation={point['accumulation']}, "
                      f"score={point['score']:.4f}")
    except Exception as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        sys.exit(1)
