export const AVALANCHE_MAINNET_PARAMS = {
	chainId: '0xA86A',
	chainName: 'Avalanche Mainnet C-Chain',
	nativeCurrency: {
		name: 'Avalanche',
		symbol: 'AVAX',
		decimals: 18,
	},
	rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
	blockExplorerUrls: ['https://snowtrace.io'],
}

export const AVALANCHE_TESTNET_PARAMS = {
	chainId: '0xA869',
	chainName: 'Avalanche Testnet C-Chain',
	nativeCurrency: {
		name: 'Avalanche',
		symbol: 'AVAX',
		decimals: 18,
	},
	rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
	blockExplorerUrls: ['https://testnet.snowtrace.io']
}

export const POLYGON_MAINNET_PARAMS = {
	chainId: '0x89',
	chainName: 'Polygon Mainnet',
	nativeCurrency: {
		name: 'Polygon',
		symbol: 'MATIC',
		decimals: 18,
	},
	rpcUrls: [
		'https://polygon-mainnet.g.alchemy.com/v2/OxEWUuDPnngCoLo6PnBesWmmg7BUqyLN',
		'https://polygon-rpc.com',
		'https://rpc-mainnet.matic.network',
		'https://rpc-mainnet.maticvigil.com',
		'https://rpc-mainnet.matic.quiknode.pro',
	],
	blockExplorerUrls: ['https://polygonscan.com'],
}

export const POLYGON_MUMBAI_TESTNET_CONFIG = {
	chainId: '0x13881',
	chainName: 'Polygon Testnet',
	nativeCurrency: {
		name: 'Polygon',
		symbol: 'MATIC',
		decimals: 18,
	},
	rpcUrls: [
		'https://polygon-mumbai.g.alchemy.com/v2/pNeHkDmnb5yRz1gD2uKctD9STtnAtmoS',
		'https://rpc-mumbai.maticvigil.com'
	],
	blockExplorerUrls: ['https://mumbai.polygonscan.com']
}

export const FANTOM_TESTNET_CONFIG = {
	chainId: '0xfa2',
	chainName: 'Fantom Testnet',
	nativeCurrency: {
		name: 'Fantom',
		symbol: 'FTM',
		decimals: 18,
	},
	rpcUrls: [
		'https://xapi.testnet.fantom.network/lachesis',
		'https://rpc.testnet.fantom.network'
	],
	blockExplorerUrls: ['https://testnet.ftmscan.com']
}

export const FANTOM_MAINNET_CONFIG = {
	chainId: '0xFA',
	chainName: 'Fantom Opera',
	nativeCurrency: {
		name: 'Fantom',
		symbol: 'FTM',
		decimals: 18,
	},
	rpcUrls: ['https://rpc.ftm.tools'],
	blockExplorerUrls: ['https://ftmscan.com'],
}

export const ETHEREUM_RINKEBY = {
	chainId: '0x4',
	chainName: 'Rinkeby',
	nativeCurrency: {
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: ["https://eth-rinkeby.alchemyapi.io/v2/-cUzoxu1XKrGZTjZkdyApr6pgcA45CQr"],
	blockExplorerUrls: ['https://rinkeby.etherscan.io']
}

export const ETHEREUM_MAINNET = {
	chainId: '0x1',
	chainName: 'Mainnet',
	nativeCurrency: {
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: ["https://eth-mainnet.alchemyapi.io/v2/Ck_TxTHd6T3d4PO38SpSoloqLdUe_2mh"],
	blockExplorerUrls: ['https://etherscan.io'],
}

export const BSC_MAINNET = {
	chainId: '0x38',
	chainName: 'Binance Smart Chain',
	nativeCurrency: {
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18
	},
	rpcUrls: ['https://bsc-dataseed.binance.org'],
	blockExplorerUrls: ['https://bscscan.com'],
}

export const BSC_TESTNET = {
	chainId: '0x61',
	chainName: 'Binance Smart Chain Testnet',
	nativeCurrency: {
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18
	},
	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
	blockExplorerUrls: ['https://testnet.bscscan.com'],
}

export const CRONOS_TESTNET = {
	chainId: '0x152',
	chainName: 'Cronos Testnet',
	nativeCurrency: {
		name: 'CRONOS',
		symbol: 'TCRO',
		decimals: 18
	},
	rpcUrls: ['https://evm-t3.cronos.org'],
	blockExplorerUrls: ['https://testnet.cronoscan.com'],
}

export const CRONOS_MAINNET = {
	chainId: '0x19',
	chainName: 'Cronos',
	nativeCurrency: {
		name: 'Cronos',
		symbol: 'CRO',
		decimals: 18
	},
	rpcUrls: ['https://evm.cronos.org'],
	blockExplorerUrls: ['https://cronoscan.com'],
}

export const SONGBIRD_TESTNET = {
	chainId: '0x10',
	chainName: 'Songbird(Coston) Testnet',
	nativeCurrency: {
		name: 'Flare',
		symbol: 'CFLR',
		decimals: 18
	},
	rpcUrls: ['https://coston-api.flare.network/ext/bc/C/rpc'],
	blockExplorerUrls: ['https://coston-explorer.flare.network'],
}

export const SONGBIRD_MAINNET = {
	chainId: '0x13',
	chainName: 'Songbird Mainnet',
	nativeCurrency: {
		name: 'Flare',
		symbol: 'SGB',
		decimals: 18
	},
	rpcUrls: ['https://songbird.towolabs.com/rpc'],
	blockExplorerUrls: ['https://songbird-explorer.flare.network'],
}

export const THINKIUM_TESTNET = {
	chainId: '0xEA61',
	chainName: 'Thinkium Testnet',
	nativeCurrency: {
		name: 'Thinkium',
		symbol: 'TKM',
		decimals: 18
	},
	rpcUrls: ['https://test1.thinkiumrpc.net'],
	blockExplorerUrls: ['http://browser.thinkiumdev.net'],
}

export const THINKIUM_MAINNET = {
	chainId: '0x11171',
	chainName: 'Thinkium Mainnet',
	nativeCurrency: {
		name: 'Thinkium',
		symbol: 'TKM',
		decimals: 18
	},
	rpcUrls: ['https://proxy1.thinkiumrpc.net'],
	blockExplorerUrls: ['https://www.thinkiumscan.net'],
}

export const ARBITRUM_MAINNET = {
	chainId: '0xA4B1',
	chainName: 'Arbitrum One (Mainnet)',
	nativeCurrency: {
		name: 'Arbitrum',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: ['https://arb1.arbitrum.io/rpc'],
	blockExplorerUrls: ['https://arbiscan.io'],
}

export const ARBITRUM_TESTNET = {
	chainId: '0x66EEB',
	chainName: 'Arbitrum Testnet',
	nativeCurrency: {
		name: 'Arbitrum',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
	blockExplorerUrls: ['https://testnet.arbiscan.io'],
}

export const OPTIMISM_MAINNET = {
	chainId: '0xA',
	chainName: 'Optimistic Ethereum (Mainnet)',
	nativeCurrency: {
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: ['https://mainnet.optimism.io'],
	blockExplorerUrls: ['https://optimistic.etherscan.io'],
}

export const OPTIMISM_TESTNET = {
	chainId: '0x45',
	chainName: 'Optimistic Ethereum Testnet',
	nativeCurrency: {
		name: 'Ethereum',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: ['https://kovan.optimism.io'],
	blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
}

export const HARMONY_MAINNET = {
	chainId: '0x63564C40',
	chainName: 'Harmony Mainnet',
	nativeCurrency: {
		name: 'Harmony Mainnet',
		symbol: 'ONE',
		decimals: 18
	},
	rpcUrls: ['https://api.harmony.one'],
	blockExplorerUrls: ['https://explorer.harmony.one/'],
}
export const HARMONY_TESTNET = {
	chainId: '0x6357D2E0',
	chainName: 'Harmony Testnet',
	nativeCurrency: {
		name: 'Harmony Testnet',
		symbol: 'ONE',
		decimals: 18
	},
	rpcUrls: ['https://api.s0.b.hmny.io'],
	blockExplorerUrls: ['https://explorer.pops.one/'],
}

export const KLAYTN_MAINNET = {
	chainId: '0x2019',
	chainName: 'Klaytn Mainnet',
	nativeCurrency: {
		name: 'Klaytn Mainnet',
		symbol: 'KLAY',
		decimals: 18
	},
	rpcUrls: ['https://public-node-api.klaytnapi.com/v1/cypress'],
	blockExplorerUrls: ['https://scope.klaytn.com'],
}
export const KLAYTN_TESTNET = {
	chainId: '0x3E9',
	chainName: 'Klaytn Testnet',
	nativeCurrency: {
		name: 'Klaytn Testnet',
		symbol: 'KLAY',
		decimals: 18
	},
	rpcUrls: ['https://api.baobab.klaytn.net:8651'],
	blockExplorerUrls: ['https://baobab.scope.klaytn.com/'],
}

export const HECO_MAINNET = {
	chainId: '0x80',
	chainName: 'Heco Mainnet',
	nativeCurrency: {
		name: 'Heco Mainnet',
		symbol: 'HT',
		decimals: 18
	},
	rpcUrls: ['https://http-mainnet.hecochain.com'],
	blockExplorerUrls: ['https://hecoinfo.com'],
}
export const HECO_TESTNET = {
	chainId: '0x100',
	chainName: 'Heco Testnet',
	nativeCurrency: {
		name: 'Heco Testnet',
		symbol: 'HT',
		decimals: 18
	},
	rpcUrls: ['https://http-testnet.hecochain.com'],
	blockExplorerUrls: ['https://testnet.hecoinfo.com/'],
}


export const testMainChainIdMap = {
	'4': 1,
	'97': 56,
	'80001': 137,
	'43113': 43114,
	'4002': 250,
	'338': 25,
	'16': 19,
	'60001': 70001,
	'421611': 42161,
	'69': 10,
	'1666700000': 1666600000,
	'1001': 8217,
	'256' : 128
}



// const CHAINS_INFO = {
// 	'0x4': {
// 		isTestnet: true,
// 		config: ETHEREUM_RINKEBY,
// 		mainnetConfig: ETHEREUM_MAINNET,
// 		mainnetChainId: 1,
// 		currency: ETHEREUM_RINKEBY['0xA869']?.nativeCurrency.symbol || 'Unknown',
// 		blockExplorer: ETHEREUM_RINKEBY['0xA869']?.blockExplorerUrls[0],
// 		faucets: ["https://rinkebyfaucet.com", "https://faucet.rinkeby.io", "https://faucets.chain.link/rinkeby"]
// 	},
// 	'0xA869': {
// 		isTestnet: true,
// 		config: AVALANCHE_TESTNET_PARAMS,
// 		mainnetConfig: AVALANCHE_MAINNET_PARAMS,
// 		mainnetChainId: 43114,
// 		currency: AVALANCHE_TESTNET_PARAMS['0xA869']?.nativeCurrency.symbol || 'Unknown',
// 		blockExplorer: AVALANCHE_TESTNET_PARAMS['0xA869']?.blockExplorerUrls[0],
// 		faucets: ["https://faucet.avax-test.network"]
// 	},
// 	'0x61': {
// 		isTestnet: true,
// 		config: BSC_TESTNET,
// 		mainnetConfig: BSC_MAINNET,
// 		mainnetChainId: 56,
// 		currency: BSC_TESTNET['0xA869']?.nativeCurrency.symbol || 'Unknown',
// 		blockExplorer: BSC_TESTNET['0xA869']?.blockExplorerUrls[0],
// 		faucets: ["https://testnet.binance.org/faucet-smart"]
// 	},
// 	'0x13881': {
// 		isTestnet: true,
// 		config: POLYGON_MUMBAI_TESTNET_CONFIG,
// 		mainnetConfig: POLYGON_MAINNET_PARAMS,
// 		mainnetChainId: 137,
// 		currency: POLYGON_MUMBAI_TESTNET_CONFIG['0xA869']?.nativeCurrency.symbol || 'Unknown',
// 		blockExplorer: POLYGON_MUMBAI_TESTNET_CONFIG['0xA869']?.blockExplorerUrls[0],
// 		faucets: ["https://faucet.polygon.technology"]
// 	},
// }

export const CHAINID_CONFIG_MAP = {
	'1': ETHEREUM_MAINNET,
	'4': ETHEREUM_RINKEBY,
	'56': BSC_MAINNET,
	'97': BSC_TESTNET,
	'137': POLYGON_MAINNET_PARAMS,
	'80001': POLYGON_MUMBAI_TESTNET_CONFIG,
	'43114': AVALANCHE_MAINNET_PARAMS,
	'43113': AVALANCHE_TESTNET_PARAMS,
	'250': FANTOM_MAINNET_CONFIG,
	'4002': FANTOM_TESTNET_CONFIG,
	'25': CRONOS_MAINNET,
	'338': CRONOS_TESTNET,
	'19': SONGBIRD_MAINNET,
	'16': SONGBIRD_TESTNET,
	'60001': THINKIUM_TESTNET,
	'70001': THINKIUM_MAINNET,
	'421611': ARBITRUM_TESTNET,
	'42161': ARBITRUM_MAINNET,
	'69': OPTIMISM_TESTNET,
	'10': OPTIMISM_MAINNET,
	'1666700000': HARMONY_TESTNET,
	'1666600000': HARMONY_MAINNET,
	'1001': KLAYTN_TESTNET,
	'8217':KLAYTN_MAINNET,
	'128': HECO_MAINNET,
	'256' :HECO_TESTNET,

	'0x1': ETHEREUM_MAINNET,
	'0x4': ETHEREUM_RINKEBY,
	'0x38': BSC_MAINNET,
	'0x61': BSC_TESTNET,
	'0x89': POLYGON_MAINNET_PARAMS,
	'0x13881': POLYGON_MUMBAI_TESTNET_CONFIG,
	'0xFA': FANTOM_MAINNET_CONFIG,
	'0xA86A': AVALANCHE_MAINNET_PARAMS,
	'0xA869': AVALANCHE_TESTNET_PARAMS,
	'0xFA2': FANTOM_TESTNET_CONFIG,
	'0x19': CRONOS_MAINNET,
	'0x152': CRONOS_TESTNET,
	'0x13': SONGBIRD_MAINNET,
	'0x10': SONGBIRD_TESTNET,
	'0xEA61': THINKIUM_TESTNET,
	'0x11171': THINKIUM_MAINNET,
	'0x66EEB': ARBITRUM_TESTNET,
	'0xA4B1': ARBITRUM_MAINNET,
	'0x45': OPTIMISM_TESTNET,
	'0xA': OPTIMISM_MAINNET,
	'0x6357D2E0': HARMONY_TESTNET,
	'0x63564C40': HARMONY_MAINNET,
	'0x2019': KLAYTN_MAINNET,
	'0x3E9': KLAYTN_TESTNET,
	'0x80': HECO_MAINNET,
	'0x100' :HECO_TESTNET,	
}

export const FAUCETS = {
	"43113": ["https://faucet.avax-test.network"],
	"80001": ["https://faucet.polygon.technology"],
	"4": ["https://rinkebyfaucet.com", "https://faucet.rinkeby.io", "https://faucets.chain.link/rinkeby"],
	"4002": ["https://faucet.fantom.network"],
	"97": ["https://testnet.binance.org/faucet-smart"],
	"338": ["https://cronos.org/faucet"],
	"16": ["https://faucet.towolabs.com"],
	"60001": ["https://www.thinkiumdev.net/DApp%20Development/Faucet.html"],
	"421611": ["https://rinkebyfaucet.com", "https://faucets.chain.link/rinkeby", "https://faucet.rinkeby.io"],
	'69': ["https://optimismfaucet.xyz"],
	'166670e0000': ["https://stakely.io/en/faucet/harmony-one"],
	'1001':["https://baobab.wallet.klaytn.foundation/faucet"],
	'256' : ["https://scan-testnet.hecochain.com/faucet"]
}

const toHex = (chainId) => {
	const isHex = isNaN(Number(chainId))
	return isHex 
		? chainId 
		: '0x' + chainId.toString(16)
}

// get corresponding mainnet config based on testnet chainID
export function getMainnetConfig(testnetChainId) {
	console.log({testnetChainId})
	if(['0x4', '4'].includes(testnetChainId)) return ETHEREUM_MAINNET
	if(['0xA869', '43113'].includes(testnetChainId)) return AVALANCHE_MAINNET_PARAMS
	if(['0x89', '80001'].includes(testnetChainId)) return POLYGON_MAINNET_PARAMS
	if(['0xFA2', '4002'].includes(testnetChainId)) return FANTOM_MAINNET_CONFIG
	if(['0x61', '97'].includes(testnetChainId)) return BSC_MAINNET
	if(['0x152', '338'].includes(testnetChainId)) return CRONOS_MAINNET
	if(['0x10', '16'].includes(testnetChainId)) return SONGBIRD_MAINNET
	if(['0xEA61', '60001'].includes(testnetChainId)) return THINKIUM_MAINNET
	if(['0x66EEB', '421611'].includes(testnetChainId)) return ARBITRUM_MAINNET
	if (['0x45', '69'].includes(testnetChainId)) return OPTIMISM_MAINNET
	if (["0x6357D2E0", '1666700000'].includes(testnetChainId)) return HARMONY_MAINNET
	if (["0x3E9", '1001'].includes(testnetChainId)) return KLAYTN_MAINNET
	if (["0x100", '256'].includes(testnetChainId)) return HECO_MAINNET

	throw new Error("Matching mainnet config not found")
}

export function getExplorerUrl(chainId) {
	return CHAINID_CONFIG_MAP[chainId]?.blockExplorerUrls[0]
}

export function getCurrency(chainId) {
	return CHAINID_CONFIG_MAP[chainId]?.nativeCurrency.symbol || 'Unknown'
}

export function getChainInfo(chainId) {
	const hexChainId = toHex(chainId)
	return CHAINS_INFO[hexChainId]
}
