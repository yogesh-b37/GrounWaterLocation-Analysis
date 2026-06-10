import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Text 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, gradients } from '../theme/colors';
import { Header, Card, StatCard, GradientButton, InfoBadge } from '../components/UIComponents';

export const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header 
        title="🏠 SlopeSense" 
        subtitle="Land Analysis Platform"
        gradient={colors.primary}
      />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Real-time slope analysis at your fingertips</Text>
        </View>

        <View style={styles.quickStatsRow}>
          <StatCard 
            style={styles.quickStatCard}
            icon="📊" 
            title="Total Sites" 
            value="12"
            subtitle="Active surveys"
            color={colors.blue}
          />
          <StatCard 
            style={styles.quickStatCard}
            icon="⚠️" 
            title="Risk Areas" 
            value="3"
            subtitle="Needs attention"
            color={colors.red}
          />
        </View>

        <View style={styles.quickStatsRow}>
          <StatCard 
            style={styles.quickStatCard}
            icon="✅" 
            title="Completed" 
            value="48"
            subtitle="This month"
            color={colors.green}
          />
          <StatCard 
            style={styles.quickStatCard}
            icon="📈" 
            title="Avg Slope" 
            value="28°"
            subtitle="Last analysis"
            color={colors.orange}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Dashboard')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[gradients.secondary[0], gradients.secondary[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickAccessCard}
          >
            <Text style={styles.cardIcon}>🗺️</Text>
            <Text style={styles.cardTitle}>View Dashboard</Text>
            <Text style={styles.cardSubtitle}>See all your analysis data</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Map')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[gradients.ocean[0], gradients.ocean[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickAccessCard}
          >
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Explore Map</Text>
            <Text style={styles.cardSubtitle}>Navigate terrain analysis</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Analysis')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[gradients.sunset[0], gradients.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickAccessCard}
          >
            <Text style={styles.cardIcon}>🔍</Text>
            <Text style={styles.cardTitle}>New Analysis</Text>
            <Text style={styles.cardSubtitle}>Start slope measurement</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  welcomeSection: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  quickStatCard: {
    width: '48%',
    minWidth: 150,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.lg,
  },
  quickAccessCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
});
