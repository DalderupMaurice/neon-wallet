// @flow
import React from 'react'

import classNames from 'classnames'
import themes from '../../themes'
import Loader from '../../components/Loader'
import styles from './Loading.scss'

export const ANIMATION_DURATION = 900 // one animation round in ms

type Props = {
  theme: ThemeType,
  nobackground?: boolean
}

export default function Loading(props: Props) {
  const { theme, nobackground: nobg } = props
  const className = classNames(styles.loading, { [styles.nobackground]: nobg })

  return (
    <div style={themes[theme]} className={className}>
      <Loader />
    </div>
  )
}
