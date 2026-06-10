import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, gradients } from '../theme/colors';
import { Header, Card, InfoBadge } from '../components/UIComponents';

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'critical', 'warning', 'safe'];

  const mockData = [
    { id: 1, name: 'Site A - North Ridge', slope: 35, risk: 'critical', color: colors.red },
    { id: 2, name: 'Site B - Valley Basin', slope: 22, risk: 'safe', color: colors.green },
    { id: 3, name: 'Site C - Highland Area', slope: 28, risk: 'warning', color: colors.yellow },
    { id: 4, name: 'Site D - Steep Peak', slope: 42, risk: 'critical', color: colors.red },
    { id: 5, name: 'Site E - Flat Terrain', slope: 12, risk: 'safe', color: colors.green },
    { id: 6, name: 'Site F - Mid Slope', slope: 25, risk: 'safe', color: colors.green },
  ];

  const filteredData = selectedFilter === 'all' 
    ? mockData 
    : mockData.filter(item => item.risk === selectedFilter);

  return (
    <View style={styles.container}>
      <Header 
        title="📊 Dashboard" 
        subtitle="Analysis Overview"
        gradient={colors.secondary}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Row */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: `${colors.red}15` }]}>
            <Text style={styles.statLabel}>Critical</Text>
            <Text style={[styles.statNumber, { color: colors.red }]}>2</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: `${colors.yellow}15` }]}>
            <Text style={styles.statLabel}>Warning</Text>
            <Text style={[styles.statNumber, { color: colors.yellow }]}>1</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: `${colors.green}15` }]}>
            <Text style={styles.statLabel}>Safe</Text>
            <Text style={[styles.statNumber, { color: colors.green }]}>3</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Site List */}
        <Text style={styles.sectionTitle}>Analysis Sites ({filteredData.length})</Text>
        {filteredData.map((site) => (
          <TouchableOpacity 
            key={site.id}
            onPress={() => navigation.navigate('Analysis', { siteId: site.id })}
            activeOpacity={0.8}
          >
            <Card style={styles.siteCard}>
              <View style={styles.siteHeader}>
                <View style={styles.siteNameContainer}>
                  <View
                    style={[
                      styles.riskIndicator,
                      { backgroundColor: site.color },
                    ]}
                  />
                  <View style={styles.siteNameText}>
                    <Text style={styles.siteName}>{site.name}</Text>
                    <Text style={styles.siteStatus}>{site.risk.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.slopeValue}>
                  <Text style={styles.slopeNumber}>{site.slope}°</Text>
                  <Text style={styles.slopeLabel}>slope</Text>
                </View>
              </View>

              <View style={styles.siteFooter}>
                <View
                  style={[
                    styles.riskBadge,
                    { backgroundColor: `${site.color}20` },
                  ]}
                >
                  <Text style={[styles.riskBadgeText, { color: site.color }]}>
                    {site.risk === 'critical' ? '⚠️' : site.risk === 'warning' ? '⚡' : '✅'} {site.risk}
                  </Text>
                </View>
                <Text style={styles.updatedTime}>Updated 2 hours ago</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Chart Section */}
        <Text style={styles.sectionTitle}>Slope Distribution</Text>
        <Card>
          <View style={styles.chartContainer}>
            {[35, 22, 28, 42, 12, 25].map((slope, index) => (
              <View key={index} style={styles.barContainer}>
                <LinearGradient
                  colors={[
                    slope > 35 ? colors.red : slope > 25 ? colors.yellow : colors.green,
                    slope > 35 ? colors.orange : slope > 25 ? colors.yellow : colors.lime,
                  ]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={[
                    styles.bar,
                    { height: (slope / 50) * 80 },
                  ]}
                />
                <Text style={styles.barLabel}>S{index + 1}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statBox: {
    flexBasis: '30%',
    minWidth: 110,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.lg,
  },
  siteCard: {
    marginVertical: spacing.sm,
    paddingVertical: spacing.md,
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  siteNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  siteNameText: {
    flex: 1,
  },
  siteName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  siteStatus: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  slopeValue: {
    alignItems: 'center',
  },
  slopeNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.blue,
  },
  slopeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  siteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
  },
  riskBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  updatedTime: {
    fontSize: 11,
    color: colors.textLight,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
