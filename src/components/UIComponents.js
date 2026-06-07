import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export const GradientButton = ({ 
  title, 
  onPress, 
  gradient = colors.primary,
  size = 'md',
  style,
  disabled = false
}) => {
  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  };

  return (
    <LinearGradient
      colors={[gradient.start, gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.button,
        sizeStyles[size],
        disabled && { opacity: 0.5 },
        style
      ]}
    >
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Text style={[styles.buttonText, { fontSize: typography[size === 'lg' ? 'body' : 'bodySmall'].fontSize }]}>
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export const Card = ({ children, style, gradient = null, onPress = null }) => {
  const cardContent = (
    <View style={[styles.card, gradient ? styles.cardWithBorder : {}, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {gradient ? (
          <LinearGradient
            colors={[gradient.start, gradient.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, style]}
          >
            {children}
          </LinearGradient>
        ) : (
          cardContent
        )}
      </TouchableOpacity>
    );
  }

  return gradient ? (
    <LinearGradient
      colors={[gradient.start, gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    cardContent
  );
};

export const StatCard = ({ icon, title, value, subtitle, color }) => (
  <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
    <View style={styles.statHeader}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </Card>
);

export const Header = ({ title, subtitle, gradient = colors.primary }) => (
  <LinearGradient
    colors={[gradient.start, gradient.end]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.header}
  >
    <Text style={styles.headerTitle}>{title}</Text>
    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
  </LinearGradient>
);

export const TabButton = ({ icon, label, active, onPress, color }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tabButton, active && { backgroundColor: colors.surfaceLight }]}
  >
    <Text style={{ fontSize: 24, marginBottom: spacing.xs }}>{icon}</Text>
    <Text style={[styles.tabLabel, active && { color }]}>{label}</Text>
  </TouchableOpacity>
);

export const InfoBadge = ({ label, value, color }) => (
  <View style={[styles.badge, { backgroundColor: `${color}10`, borderColor: color, borderWidth: 1 }]}>
    <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
    <Text style={[styles.badgeValue, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardWithBorder: {
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  statCard: {
    marginVertical: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: `rgba(255,255,255,0.8)`,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    margin: spacing.xs,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  badgeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
