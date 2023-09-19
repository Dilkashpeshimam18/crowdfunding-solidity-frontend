import React, { useContext, createContext } from "react";
import { useAddress, useMetamask, useContract, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from "ethers";

const StateContext = createContext()

const StateProvider = ({ children }) => {
    const { contract } = useContract('0x9D6b9819a62E405d10D6Ca5F44682937Ed1B0395')

    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign')
    const connect = useMetamask()
    const address = useAddress()

    const publishCampaign = async (form) => {
        try {

            const data = await createCampaign([
                address, //owner of the campaign
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image,
            ])

            console.log('Contract created', data)

        } catch (err) {
            console.log(err)
        }
    }

    const getCampaigns = async () => {
        try {
            const campaigns = contract.call('getAllCampaigns')
            console.log(campaigns)

            const updatedCampaigns = campaigns.map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: i

            }))

            return updatedCampaigns

        } catch (err) {
            console.log(err)
        }
    }

    const getUserCampaigns = async () => {
        try {

            const allCampaigns = await getCampaigns()

            const userCampaign = allCampaigns.filter((campaign) => campaign.owner === address)

            return userCampaign;

        } catch (err) {
            console.log(err)
        }
    }

    const donate=async(pId,amount)=>{
        try{

            const data=await contract.call('donateToCampaign',[pId],{value:ethers.utils.parseEther(amount)})

            return data;

        }catch(err){
            console.log(err)
        }
    }
    return (
        <StateContext.Provider
            value={{
                address,
                createCampaign: publishCampaign,
                contract,
                connect,
                getCampaigns,
                getUserCampaigns,
                donate
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)