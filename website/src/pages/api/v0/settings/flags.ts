import { NextApiRequest, NextApiResponse } from 'next'
import { FeatureFlag } from '@shared-types/website'
import Cors from 'cors'
import { runMiddleware } from '../../../../utils/middleware'
import { EnvironmentNetwork } from '../../../../../../shared/environment'

export const cors = Cors({
  methods: ['GET', 'HEAD']
})

export default async function handle (req: NextApiRequest, res: NextApiResponse<FeatureFlag[]>): Promise<void> {
  await runMiddleware(req, res, cors)
  res.json([
    {
      id: 'loan',
      name: 'Loans',
      stage: 'public',
      version: '>=0.17.0',
      description: 'Browse loan tokens provided by DeFiChain',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    },
    {
      id: 'auction',
      name: 'Auction',
      stage: 'public',
      version: '>=0.23.0',
      description: 'Browse auctions provided by DeFiChain',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'dfi_loan_payment',
      name: 'DFI Loan Payment',
      stage: 'alpha',
      version: '<1.0.0',
      description: 'DFI Loan Payment',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'local_storage',
      name: 'Native local storage',
      stage: 'public',
      version: '>1.6.0',
      description: 'Native local storage',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'dusd_vault_share',
      name: 'DUSD 50% contribution',
      stage: 'public',
      version: '>1.8.1',
      description: 'DUSD 50% contribution in required collateral token',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'dusd_loan_payment',
      name: 'DUSD Loan Payment',
      stage: 'alpha',
      version: '>1.8.1',
      description: 'Allow DUSD payment on loans (+1% fee if paying a Non-DUSD loan)',
      networks: [EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'future_swap',
      name: 'Future swap',
      stage: 'public',
      version: '>1.11.0',
      description: 'Allow Future Swap at Settlement block',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'service_provider',
      name: 'Service Provider',
      stage: 'beta',
      version: '>1.13.0',
      description: 'Allows the usage of custom server provider url',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'onboarding_v2',
      name: 'Onboarding 2.0',
      stage: 'public',
      version: '>1.14.3',
      description: 'Display redesigned onboarding flow for LW 2.0',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'dusd_dfi_high_fee',
      name: 'DUSD-DFI High Fees',
      stage: 'public',
      version: '>0.0.0',
      description: 'There are high fees in DUSD and DFI as of the moment',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'setting_v2',
      name: 'Setting 2.0',
      stage: 'public',
      version: '>1.15.1',
      description: 'Display redesigned Setting flow for LW 2.0',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }, {
      id: 'portfolio_v2',
      name: 'Portfolio 2.0',
      stage: 'alpha',
      version: '>1.16.0',
      description: 'Display redesigned Portfolio flow for LW 2.0',
      networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
      platforms: ['ios', 'android', 'web']
    }
  ])
}
