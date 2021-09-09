import * as React from "react"
import { useEffect, useState } from "react"
import { gql, useMutation } from "@apollo/client"
import { ActivityIndicator, Text, View } from "react-native"
import { Button } from "react-native-elements"
import QRCode from "react-native-qrcode-svg"
import EStyleSheet from "react-native-extended-stylesheet"

import { Screen } from "../../components/screen"
import { palette } from "../../theme/palette"

const GENERATE_2FA = gql`
  mutation generate2FA {
    generate2fa {
      secret
      uri
    }
  }
`

const authenticatorAppsData = [
  {
    name: "Google Authenticator",
    link: ""
  },
  {
    name: "Microsoft Authenticator",
    link: ""
  },
  {
    name: "Duo",
    link: ""
  },
  {
    name: "Authy",
    link: ""
  },
]

export const TwoFactorAuthenticationScreen = (): JSX.Element => {

  const [twoFASecret, setTwoFASecret] = useState<string | null>()
  const [twoFAUri, setTwoFAUri] = useState<string | null>()

  const [generate2FA, { loading: loadingGenerate2FA }] = useMutation(GENERATE_2FA)

  useEffect(() => {
    ;(async () => {
      const { data } = await generate2FA()
      setTwoFASecret(data?.generate2fa?.secret)
      setTwoFAUri(data?.generate2fa?.uri)
    })()
  }, [generate2FA])

  return (
    <Screen preset="fixed">
      <View style={styles.authenticatorAppContainer}>
        <Text>Auth Text</Text>
      </View>
      <View style={styles.twoFAContainer}>
        <View style={styles.qrContainer}>
          { loadingGenerate2FA && <ActivityIndicator animating size="large" /> }
          { twoFASecret && twoFAUri 
            && <QRCode
              ecl="M"
              size={280}
              value={twoFAUri}
            />
          }
        </View>
      </View>
      <View style={styles.explainerContainer}>
      </View>
    </Screen>
  )
}

const styles = EStyleSheet.create({
  authenticatorAppContainer: {
    flex: 1,
  },

  explainerContainer: {
    flex: 2,
  },

  qrContainer: {
    alignItems: "center",
    backgroundColor: palette.red,
    flex: 2,
    justifyContent: "center",
  },

  twoFAContainer: {
    flexDirection: "column"
  },
})
