import { ThemedIcon, ThemedViewV2 } from '@components/themed'
import { WalletAlert } from '@components/WalletAlert'
import { useNetworkContext } from '@shared-contexts/NetworkContext'
import { EnvironmentNetwork, isPlayground } from '@environment'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { SettingsParamList } from '@screens/AppNavigator/screens/Settings/SettingsNavigator'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import { ThemedTextV2 } from './themed/ThemedTextV2'
import { ThemedTouchableOpacityV2 } from './themed/ThemedTouchableOpacityV2'

interface NetworkItemRowProps {
  network: EnvironmentNetwork
  alertMessage: string
  isLast: boolean
  disabled?: boolean
}

export function NetworkItemRowV2 (props: NetworkItemRowProps): JSX.Element {
  const navigation = useNavigation<NavigationProp<SettingsParamList>>()
  const {
    network,
    updateNetwork
  } = useNetworkContext()

  const onPress = async (): Promise<void> => {
    if (props.network === network) {
      if (isPlayground(props.network)) {
        navigation.navigate('Playground')
      }
    } else {
      WalletAlert({
        title: translate('screens/Settings', 'Network Switch'),
        message: props.alertMessage,
        buttons: [
          {
            text: translate('screens/Settings', 'No'),
            style: 'cancel'
          },
          {
            text: translate('screens/Settings', 'Yes'),
            style: 'destructive',
            onPress: async () => {
              await updateNetwork(props.network)
            }
          }
        ]
      })
    }
  }

  return (
    <ThemedViewV2
      style={tailwind('border-b-0.5', { 'border-0': props.isLast })}
      light={tailwind('border-mono-light-v2-300')}
      dark={tailwind('border-mono-dark-v2-300')}
    >
      <ThemedTouchableOpacityV2
        onPress={onPress}
        style={tailwind('flex-row py-4.5 items-center justify-between border-0')}
        testID={`button_network_${props.network}`}
        disabled={props.disabled}
      >
        <ThemedTextV2 style={tailwind('text-sm font-normal-v2')}>
          {props.network}
        </ThemedTextV2>

        <ThemedIcon
          light={tailwind({ 'text-green-v2': props.network === network, 'text-mono-light-v2-700 opacity-30': props.network !== network })}
          dark={tailwind({ 'text-green-v2': props.network === network, 'text-mono-dark-v2-700 opacity-30': props.network !== network })}
          iconType='MaterialCommunityIcons'
          name='check-circle'
          size={20}
          testID={`button_network_${props.network}_check`}
        />
      </ThemedTouchableOpacityV2>
    </ThemedViewV2>
  )
}
