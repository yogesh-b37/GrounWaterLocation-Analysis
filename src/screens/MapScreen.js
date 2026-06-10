import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, gradients } from '../theme/colors';
import { Header, Card } from '../components/UIComponents';

const { width } = Dimensions.get('window');

export const MapScreen = ({ navigation }) => {
  const [mapType, setMapType] = useState('terrain');
  const [showFilters, setShowFilters] = useState(false);

  const locations = [
    { id: 1, name: 'Site A', lat: '40.7128°N', lon: '74.0060°W', slope: 35, color: colors.red },
    { id: 2, name: 'Site B', lat: '40.7250°N', lon: '74.0100°W', slope: 22, color: colors.green },
    { id: 3, name: 'Site C', lat: '40.7100°N', lon: '73.9900°W', slope: 28, color: colors.yellow },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="🗺️ Map View" 
        subtitle="Terrain Analysis"
        gradient={colors.secondary}
      />
      
      {/* Mock Map Area */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={mapType === 'terrain' ? [colors.lime, colors.green] : [colors.cyan, colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mapArea}
        >
          <View style={styles.mapContent}>
            <Text style={styles.mapText}>
              {mapType === 'terrain' ? '🏔️ Terrain Map' : '🛰️ Satellite View'}
            </Text>
            
            {/* Mock Location Pins */}
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => setShowFilters(!showFilters)}
                activeOpacity={0.8}
                style={[
                  styles.locationPin,
                  {
                    left: `${20 + (loc.id * 15)}%`,
                    top: `${30 + (loc.id * 10)}%`,
                  },
                ]}
              >
                <LinearGradient
                  colors={[loc.color, `${loc.color}AA`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pin}
                >
                  <Text style={styles.pinText}>{loc.slope}°</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            onPress={() => setMapType('terrain')}
            style={[
              styles.controlButton,
              mapType === 'terrain' && { backgroundColor: colors.primary.start },
            ]}
          >
            <Text style={styles.controlText}>🏔️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMapType('satellite')}
            style={[
              styles.controlButton,
              mapType === 'satellite' && { backgroundColor: colors.primary.start },
            ]}
          >
            <Text style={styles.controlText}>🛰️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Locations List */}
      <View style={styles.locationsContainer}>
        <View style={styles.locationsHeader}>
          <Text style={styles.locationsTitle}>📌 Nearby Locations</Text>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            onPress={() => navigation.navigate('Analysis', { locationId: location.id })}
            activeOpacity={0.8}
          >
            <Card style={styles.locationCard}>
              <View style={styles.locationContent}>
                <View style={styles.locationInfo}>
                  <View
                    style={[
                      styles.locationColor,
                      { backgroundColor: location.color },
                    ]}
                  />
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationCoords}>
                      {location.lat} | {location.lon}
                    </Text>
                  </View>
                </View>
                <View style={styles.locationSlopeBox}>
                  <LinearGradient
                    colors={[location.color, `${location.color}AA`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.slopeGradient}
                  >
                    <Text style={styles.slopeText}>{location.slope}°</Text>
                  </LinearGradient>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    height: 280,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  mapArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  locationPin: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pin: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  pinText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 11,
  },
  mapControls: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.surfaceLight,
  },
  controlText: {
    fontSize: 18,
  },
  locationsContainer: {
    flex: 0.4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  locationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterIcon: {
    fontSize: 20,
  },
  locationCard: {
    marginVertical: spacing.sm,
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationColor: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationCoords: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  locationSlopeBox: {
    width: 50,
    height: 40,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  slopeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slopeText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 12,
  },
});
