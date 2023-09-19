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

    return (
        <StateContext.Provider
        value={{
            address,
            createCampaign:publishCampaign,
            contract,
            connect
        }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext=()=>useContext(StateContext)