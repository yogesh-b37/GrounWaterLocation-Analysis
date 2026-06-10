import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, gradients } from '../theme/colors';
import { Header, Card, GradientButton, InfoBadge } from '../components/UIComponents';

const { width } = Dimensions.get('window');

export const AnalysisScreen = ({ route }) => {
  const [selectedTool, setSelectedTool] = useState('measure');
  const [analysisData, setAnalysisData] = useState({
    slopeAngle: 28.5,
    elevation: 1250,
    distance: 150,
    area: 5000,
    riskLevel: 'medium',
  });

  const tools = [
    { id: 'measure', icon: '📏', label: 'Measure' },
    { id: 'analyze', icon: '🔬', label: 'Analyze' },
    { id: 'compare', icon: '📊', label: 'Compare' },
    { id: 'export', icon: '💾', label: 'Export' },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="🔍 Analysis" 
        subtitle="Detailed Slope Measurement"
        gradient={colors.accent}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tool Selector */}
        <View style={styles.toolSelector}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => setSelectedTool(tool.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedTool === tool.id
                    ? [colors.blue, colors.purple]
                    : [colors.surface, colors.surfaceLight]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.toolButton}
              >
                <Text style={styles.toolIcon}>{tool.icon}</Text>
                <Text
                  style={[
                    styles.toolLabel,
                    selectedTool === tool.id && { color: colors.surface },
                  ]}
                >
                  {tool.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Analysis Visualization */}
        <Card>
          <LinearGradient
            colors={[gradients.ocean[0], gradients.ocean[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.visualizationArea}
          >
            <View style={styles.triangleContainer}>
              <View style={styles.triangle} />
              <Text style={styles.angleText}>{analysisData.slopeAngle}°</Text>
            </View>
            <Text style={styles.visualLabel}>
              {selectedTool === 'measure'
                ? '📐 Slope Measurement'
                : selectedTool === 'analyze'
                ? '🔬 Terrain Analysis'
                : selectedTool === 'compare'
                ? '📊 Comparison View'
                : '💾 Export Data'}
            </Text>
          </LinearGradient>
        </Card>

        {/* Measurement Results */}
        <Text style={styles.sectionTitle}>📊 Measurement Results</Text>
        
        <Card>
          <View style={styles.resultGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Slope Angle</Text>
              <Text style={[styles.resultValue, { color: colors.blue }]}>
                {analysisData.slopeAngle}°
              </Text>
              <Text style={styles.resultUnit}>Degrees</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Elevation</Text>
              <Text style={[styles.resultValue, { color: colors.green }]}>
                {analysisData.elevation}m
              </Text>
              <Text style={styles.resultUnit}>Height</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Distance</Text>
              <Text style={[styles.resultValue, { color: colors.orange }]}>
                {analysisData.distance}m
              </Text>
              <Text style={styles.resultUnit}>Length</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Area</Text>
              <Text style={[styles.resultValue, { color: colors.purple }]}>
                {(analysisData.area / 1000).toFixed(1)}K
              </Text>
              <Text style={styles.resultUnit}>Sq.M</Text>
            </View>
          </View>
        </Card>

        {/* Risk Assessment */}
        <Text style={styles.sectionTitle}>⚠️ Risk Assessment</Text>
        
        <Card>
          <View style={styles.riskContainer}>
            <View style={styles.riskItem}>
              <Text style={styles.riskTitle}>Stability Index</Text>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[colors.yellow, colors.orange]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: '65%', height: '100%', borderRadius: 4 }}
                />
              </View>
              <Text style={styles.riskValue}>65% - Medium Risk</Text>
            </View>
          </View>

          <View style={styles.riskBadgesContainer}>
            <InfoBadge label="Rock Type" value="Granite" color={colors.blue} />
            <InfoBadge label="Soil pH" value="6.8" color={colors.green} />
            <InfoBadge label="Moisture" value="42%" color={colors.cyan} />
          </View>
        </Card>

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>💡 Recommendations</Text>
        
        {[
          { icon: '🛡️', text: 'Install slope stabilization measures' },
          { icon: '💧', text: 'Monitor water drainage systems' },
          { icon: '📍', text: 'Regular surveillance required' },
          { icon: '🔧', text: 'Consider reinforcement structures' },
        ].map((rec, index) => (
          <Card key={index} style={styles.recommendationCard}>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationIcon}>{rec.icon}</Text>
              <Text style={styles.recommendationText}>{rec.text}</Text>
            </View>
          </Card>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <View style={styles.actionButton}>
            <GradientButton
              title="Save Analysis"
              onPress={() => alert('Analysis saved!')}
              gradient={colors.primary}
              size="md"
            />
          </View>
          <View style={styles.actionButton}>
            <GradientButton
              title="Share Report"
              onPress={() => alert('Sharing...')}
              gradient={colors.secondary}
              size="md"
            />
          </View>
        </View>
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
  toolSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  toolButton: {
    flex: 1,
    minWidth: 128,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  visualizationArea: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangleContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 87,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  angleText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: '700',
    color: colors.surface,
  },
  visualLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.lg,
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.sm,
  },
  resultItem: {
    flexBasis: '48%',
    minWidth: 140,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: spacing.xs,
  },
  resultUnit: {
    fontSize: 10,
    color: colors.textLight,
  },
  riskContainer: {
    marginBottom: spacing.md,
  },
  riskItem: {
    marginBottom: spacing.md,
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  riskValue: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  riskBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  recommendationCard: {
    marginVertical: spacing.sm,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  actionButton: {
    flex: 1,
    minWidth: 140,
    marginBottom: spacing.sm,
  },
});
