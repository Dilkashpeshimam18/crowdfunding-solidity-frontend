import React, { useContext, createContext, useState, useEffect } from "react";
import { useAddress, useMetamask, useContract, useContractRead } from '@thirdweb-dev/react'
import { ethers } from "ethers";
import { contractAbi } from '../constant'
const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const { contract, isLoading, error:contractError } = useContract(
        "0x0B575A6ad72586290f96cb734449c45cE21c2f49",
        contractAbi,
    );
    const connect = useMetamask();
    const address = useAddress();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        if (contractError) {
            console.error("Contract initialization error:", contractError);
        }
    }, [contractError]);
    const { data, error: readError } = useContractRead(contract, "getAllCampaigns", []);

    if (readError) {
        console.error("Error reading from contract:", readError);
    }

    const getCampaigns = async () => {
        try {
            if (data) {

                const updatedCampaigns = data.map((campaign, i) => ({
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
            } else {
                return [];
            }


        } catch (err) {
            console.log(err)
        }
    }

    const publishCampaign = async (form) => {
  
        try {

            const data = await contract.call('createCampaign',
                [
                    address, //owner of the campaign
                    form.title,
                    form.description,
                    form.image,
                    form.target,
                    new Date(form.deadline).getTime(),
                ]
            )


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

    const donate = async (pId, amount) => {
        try {

            const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) })

            return data;

        } catch (err) {
            console.log(err)
        }
    }

    const getDonations = async (pId) => {
        try {
            const donations = await contract.call('getAllDonators', [pId])
            const numberOfDonations = donations[0]?.length;
            const updatedDonations = []
            for (let i = 0; i < numberOfDonations; i++) {
                updatedDonations.push({
                    donator: donations[0][i],
                    donation: ethers.utils.formatEther(donations[1][i].toString())
                })
            }


            return updatedDonations

        } catch (err) {
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
                donate,
                getDonations,
                campaigns,
                setCampaigns
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)