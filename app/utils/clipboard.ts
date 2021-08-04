import Clipboard from "@react-native-community/clipboard"
import { ApolloClient } from "@apollo/client"

import { validPayment } from "./parsing"
import { modalClipboardVisibleVar, walletIsActive } from "../graphql/query"
import { cache } from "../graphql/cache"
import { LAST_CLIPBOARD_PAYMENT } from "../graphql/client-only-query"
import { INetwork } from "../types/network"

type ShowModalClipboardIfValidPaymentInput = {
  client: ApolloClient<unknown>
  network: INetwork
}

export const showModalClipboardIfValidPayment = async (
  // eslint-disable-next-line @typescript-eslint/ban-types
  { client, network }: ShowModalClipboardIfValidPaymentInput,
): Promise<void> => {
  const clipboard = await Clipboard.getString()

  if (!walletIsActive(client)) {
    return
  }

  const { lastClipboardPayment } = cache.readQuery({ query: LAST_CLIPBOARD_PAYMENT })
  if (clipboard === lastClipboardPayment) {
    return
  }

  const { valid } = validPayment(clipboard, network, client)
  if (!valid) {
    return
  }

  modalClipboardVisibleVar(true)
}
