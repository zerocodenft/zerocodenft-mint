import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default function ({ $siteConfig }, inject) {

    if(!$siteConfig.smartContract){
        inject('smartContract', {})
        return
    }
    
	const {
        abi,
        address,
        chainId
    } = $siteConfig.smartContract

    const providerUrl = CHAINID_CONFIG_MAP[chainId.toString()].rpcUrls[0]
    const jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(providerUrl)
    const smartContract = new ethers.Contract(address, abi, jsonRpcProvider)

    // console.log(smartContract)

    inject('smartContract', smartContract)
}
