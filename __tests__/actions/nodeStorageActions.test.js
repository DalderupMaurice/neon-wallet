import { api } from 'neon-js'
import nock from 'nock'

import nodeStorageActions, {
  determineIfCacheIsExpired,
  getRPCEndpoint,
  parseUrlData
} from '../../app/actions/nodeStorageActions'
import {
  TEST_NETWORK_ID,
  TEST_NETWORK_LABEL,
  NODES_TEST_NET
} from '../../app/core/constants'

const MINUTES_AS_MS =
  25 /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */

describe('nodeStorageActions', () => {
  describe('cancel', () => {
    test('returns an action object', () => {
      expect(nodeStorageActions.cancel()).toEqual({
        batch: false,
        type: 'nodeStorage/ACTION/CANCEL',
        meta: {
          id: 'nodeStorage',
          type: 'ACTION/CANCEL'
        }
      })
    })
  })

  describe('reset', () => {
    test('returns an action object', () => {
      expect(nodeStorageActions.reset()).toEqual({
        batch: false,
        type: 'nodeStorage/ACTION/RESET',
        meta: {
          id: 'nodeStorage',
          type: 'ACTION/RESET'
        }
      })
    })
  })

  describe('call', () => {
    test('returns an action object', () => {
      expect(nodeStorageActions.call({ networkId: TEST_NETWORK_ID })).toEqual({
        batch: false,
        type: 'nodeStorage/ACTION/CALL',
        meta: {
          id: 'nodeStorage',
          type: 'ACTION/CALL'
        },
        payload: {
          fn: expect.any(Function)
        }
      })
    })
    test('payload function returns an empty string with no node in storage', async done => {
      const call = nodeStorageActions.call({ networkId: TEST_NETWORK_ID })
      expect(await call.payload.fn({})).toEqual('')
      done()
    })
  })

  describe('cacheReset', () => {
    test('returns true when current date is AFTER default expiration', () => {
      expect(
        determineIfCacheIsExpired(new Date().getTime() - MINUTES_AS_MS)
      ).toEqual(true)
    })

    test('returns false when current date is BEFORE default expiration', () => {
      expect(determineIfCacheIsExpired(new Date().getTime())).toEqual(false)
    })
  })

  describe('getRPCEndpoint', () => {
    test('returns an RPC endpoint', async () => {
      nock.enableNetConnect()
      const selectedNode = await getRPCEndpoint(TEST_NETWORK_LABEL)
      const arrOfCandidates = NODES_TEST_NET.map(parseUrlData)
      expect(arrOfCandidates).toContain(selectedNode)
      nock.disableNetConnect()
    })
  })
})
