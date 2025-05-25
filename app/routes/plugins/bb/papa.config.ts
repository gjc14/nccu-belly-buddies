import type { PapaConfig } from '../utils/get-plugin-configs.server'

const config = (): PapaConfig => {
	return {
		pluginName: 'Belly Buddies',
		adminRoutes: [
			{
				title: 'Restaurant',
				url: 'restaurant',
				iconName: 'chef-hat',
			},
		],
	}
}

export default config
