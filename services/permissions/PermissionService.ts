import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';

export enum PermissionType {
  MICROPHONE = 'microphone',
  NOTIFICATIONS = 'notifications',
}

export interface PermissionResult {
  granted: boolean;
  status: PermissionStatus;
  canAskAgain: boolean;
}

export class PermissionService {
  private static getPermissionConstant(type: PermissionType): Permission {
    const platformPermissions = {
      [PermissionType.MICROPHONE]: {
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      },
      [PermissionType.NOTIFICATIONS]: {
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      },
    };

    const platform = Platform.OS as 'ios' | 'android';
    return platformPermissions[type][platform];
  }

  static async checkPermission(
    type: PermissionType,
  ): Promise<PermissionResult> {
    try {
      const permission = this.getPermissionConstant(type);
      const status = await check(permission);

      return {
        granted: status === RESULTS.GRANTED,
        status,
        canAskAgain: status !== RESULTS.BLOCKED,
      };
    } catch (error) {
      console.warn('🔐 Permission Error:', error);

      return {
        granted: false,
        status: RESULTS.UNAVAILABLE,
        canAskAgain: false,
      };
    }
  }

  static async requestPermission(
    type: PermissionType,
  ): Promise<PermissionResult> {
    try {
      const permission = this.getPermissionConstant(type);
      const status = await request(permission);

      const result = {
        granted: status === RESULTS.GRANTED,
        status,
        canAskAgain: status !== RESULTS.BLOCKED,
      };

      console.log(
        `🔐 Permission ${type} ${result.granted ? 'granted' : 'denied'}`,
      );

      return result;
    } catch (error) {
      console.warn('🔐 Permission Error:', error);

      return {
        granted: false,
        status: RESULTS.UNAVAILABLE,
        canAskAgain: false,
      };
    }
  }

  static async requestMicrophonePermission(): Promise<PermissionResult> {
    const result = await this.requestPermission(PermissionType.MICROPHONE);

    if (!result.granted && result.canAskAgain) {
      Alert.alert(
        'Microphone Permission Required',
        'Voice recognition requires microphone access to understand your commands. Please allow microphone access in the next dialog.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Try Again',
            onPress: () => this.requestMicrophonePermission(),
          },
        ],
      );
    } else if (!result.granted && !result.canAskAgain) {
      this.showSettingsAlert(
        'Microphone Access Blocked',
        'Voice recognition is disabled. To enable it, please go to Settings > Privacy > Microphone and allow access for this app.',
      );
    }

    return result;
  }

  private static showSettingsAlert(title: string, message: string): void {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ]);
  }

  static getPermissionStatusMessage(
    type: PermissionType,
    status: PermissionStatus,
  ): string {
    const messages: Record<string, string> = {
      [RESULTS.UNAVAILABLE]: `${type} permission is not available on this device.`,
      [RESULTS.DENIED]: `${type} permission was denied. You can enable it in Settings.`,
      [RESULTS.GRANTED]: `${type} permission is granted.`,
      [RESULTS.BLOCKED]: `${type} permission is blocked. Please enable it in Settings.`,
      [RESULTS.LIMITED]: `${type} permission is limited. Please check Settings.`,
    };

    return messages[status] || `Unknown ${type} permission status.`;
  }

  static async checkMultiplePermissions(
    types: PermissionType[],
  ): Promise<Record<PermissionType, PermissionResult>> {
    const results: Record<PermissionType, PermissionResult> = {} as any;

    await Promise.all(
      types.map(async type => {
        results[type] = await this.checkPermission(type);
      }),
    );

    return results;
  }

  static async requestMultiplePermissions(
    types: PermissionType[],
  ): Promise<Record<PermissionType, PermissionResult>> {
    const results: Record<PermissionType, PermissionResult> = {} as any;

    for (const type of types) {
      results[type] = await this.requestPermission(type);

      if (!results[type].granted && type === PermissionType.MICROPHONE) {
        break;
      }
    }

    return results;
  }
}

export const checkMicrophonePermission = () =>
  PermissionService.checkPermission(PermissionType.MICROPHONE);

export const requestMicrophonePermission = () =>
  PermissionService.requestMicrophonePermission();
