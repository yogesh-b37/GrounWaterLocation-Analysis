import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Header, Card } from '../components/UIComponents';

export const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    location: true,
    analytics: true,
    autoSave: true,
    precision: true,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const SettingRow = ({ icon, title, subtitle, value, onToggle }) => (
    <Card style={styles.settingCard}>
      <View style={styles.settingContent}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingIcon}>{icon}</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        {value !== undefined && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.surfaceLight, true: colors.green }}
            thumbColor={value ? colors.surface : colors.textLight}
          />
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="⚙️ Settings" 
        subtitle="Customize Your Experience"
        gradient={colors.blue}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Text style={styles.sectionTitle}>👤 Profile</Text>
        <Card>
          <View style={styles.profileContainer}>
            <LinearGradient
              colors={[colors.blue, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>JD</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@slopesense.com</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        <SettingRow
          icon="📢"
          title="Enable Notifications"
          subtitle="Receive alerts about slope changes"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        <SettingRow
          icon="📍"
          title="Location Services"
          subtitle="Allow app to access your location"
          value={settings.location}
          onToggle={() => toggleSetting('location')}
        />

        {/* Display */}
        <Text style={styles.sectionTitle}>🎨 Display</Text>
        <SettingRow
          icon="🌙"
          title="Dark Mode"
          subtitle="Apply dark theme"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />

        {/* Data & Privacy */}
        <Text style={styles.sectionTitle}>🔒 Data & Privacy</Text>
        <SettingRow
          icon="📊"
          title="Analytics"
          subtitle="Help improve SlopeSense"
          value={settings.analytics}
          onToggle={() => toggleSetting('analytics')}
        />
        <SettingRow
          icon="💾"
          title="Auto-Save"
          subtitle="Automatically save analysis"
          value={settings.autoSave}
          onToggle={() => toggleSetting('autoSave')}
        />

        {/* Measurement */}
        <Text style={styles.sectionTitle}>📏 Measurement</Text>
        <SettingRow
          icon="🎯"
          title="High Precision Mode"
          subtitle="Enables advanced calculations"
          value={settings.precision}
          onToggle={() => toggleSetting('precision')}
        />

        {/* About */}
        <Text style={styles.sectionTitle}>ℹ️ About</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </Card>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>2024.06.01</Text>
          </View>
        </Card>

        {/* Support */}
        <Text style={styles.sectionTitle}>💬 Support</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Card style={styles.actionCard}>
            <View style={styles.actionContent}>
              <Text style={styles.actionIcon}>📧</Text>
              <Text style={styles.actionText}>Contact Support</Text>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Card style={styles.actionCard}>
            <View style={styles.actionContent}>
              <Text style={styles.actionIcon}>📚</Text>
              <Text style={styles.actionText}>Documentation</Text>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Card style={styles.actionCard}>
            <View style={styles.actionContent}>
              <Text style={styles.actionIcon}>⚖️</Text>
              <Text style={styles.actionText}>Terms & Privacy</Text>
              <Text style={styles.actionArrow}>→</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton}>
          <LinearGradient
            colors={[colors.red, colors.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutGradient}
          >
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>SlopeSense © 2024</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.lg,
  },
  settingCard: {
    marginVertical: spacing.sm,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.blue,
  },
  infoCard: {
    marginVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionCard: {
    marginVertical: spacing.sm,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionArrow: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  logoutGradient: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textLight,
    marginVertical: spacing.xl,
  },
});
