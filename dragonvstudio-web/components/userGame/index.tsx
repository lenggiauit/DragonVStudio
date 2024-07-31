'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../translation'
import { useParams } from 'next/navigation'
import {
  useGetPlayerGameItemsMutation,
  useGetPlayerInfoMutation,
  useGetShopGameItemsMutation,
  usePLayerDeleteGameItemMutation,
  usePlayerBuyGameItemMutation,
  usePlayerEquipItemMutation,
} from '@/services/mountAndBladeGameService'
import { useSession } from 'next-auth/react'
import { Player, UserGameItems } from '@/services/models/adminGame/player'
import PageLoading from '../pageLoading'
import { useAppContext } from '@/contexts/appContext'
import { AppSetting, FormKeyword, MetaData, Paging } from '@/types/type'
import * as Yup from 'yup'
import { FormikHelpers } from 'formik'
import { GameItem } from '@/services/models/adminGame/gameItem'
import Pagination from '../pagination'
import showConfirmModal from '../modal'
import { toast } from 'react-toastify'
import { ResultCode } from '@/utils/enums'
import showDialogModal from '../modal/showModal'
import dayjs from 'dayjs'
import { GetTypeNameOfItem } from '@/utils/functions'
import { v4 } from 'uuid'
let appSetting: AppSetting = require('../../appSetting.json')

const UserGame: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()
  const { data: session, status } = useSession()
  const { locale, setLocale } = useAppContext()
  const [GetPlayerInfo, GetPlayerInfoStatus] = useGetPlayerInfoMutation()
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>()

  useEffect(() => {
    GetPlayerInfo({ payload: { userId: session?.user.id }, gameUrl: gameUrl })
  }, [])

  useEffect(() => {
    if (
      GetPlayerInfoStatus.isSuccess &&
      GetPlayerInfoStatus.data.resource != null
    ) {
      setCurrentPlayer(GetPlayerInfoStatus.data.resource)
    }
  }, [GetPlayerInfoStatus])

  // shop item

  const [keyWords, setKeyWords] = useState<string | null>('')
  let initialFormKeyword: FormKeyword = {
    keywords: '',
  }

  const validationSchema = () => {
    return Yup.object().shape({
      keywords: Yup.string().max(20),
    })
  }

  const handleOnSubmit = (
    values: FormKeyword,
    actions: FormikHelpers<FormKeyword>
  ) => {
    setKeyWords(values.keywords)
  }

  // get list
  const [getItemList, getItemListStatus] = useGetShopGameItemsMutation()

  //

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalShopItemRows, setTotalShopItemRows] = useState<number>(0)

  const [ShopItemList, setShopItemList] = useState<GameItem[]>([])

  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null)

  const pagingChangeEvent: any = (p: Paging) => {
    let mp: Paging = {
      index: p.index,
      size: p.size,
    }
    setPagingData(mp)
  }
  useEffect(() => {
    let md: MetaData = {
      paging: pagingData,
    }
    setMetaData(md)
  }, [pagingData])

  useEffect(() => {
    getItemList({
      payload: { keywords: keyWords },
      metaData: metaData,
      gameUrl: gameUrl,
    })
  }, [metaData, keyWords])

  useEffect(() => {
    if (
      getItemListStatus.isSuccess &&
      getItemListStatus.data.resource != null
    ) {
      let data = getItemListStatus.data.resource
      setTotalShopItemRows(getItemListStatus.data.total)
      setShopItemList(data)
    }
  }, [getItemListStatus])

  // buy item
  const [PlayerBuyGameItem, PlayerBuyGameItemStatus] =
    usePlayerBuyGameItemMutation()

  const handleBuyItem = (item: GameItem) => {
    showConfirmModal({
      message: `Are you sure you want to buy "${item.name}"?`,
      onConfirm: () => {
        PlayerBuyGameItem({ payload: { itemId: item.id }, gameUrl: gameUrl })
      },
    })
  }

  useEffect(() => {
    if (
      PlayerBuyGameItemStatus.data &&
      PlayerBuyGameItemStatus.data.resultCode == ResultCode.Success
    ) {
      GetPlayerInfo({ payload: { userId: session?.user.id }, gameUrl: gameUrl })
      getPlayerItemList({
        payload: { keywords: keyWords },
        gameUrl: gameUrl,
      })
      getItemList({
        payload: { keywords: keyWords },
        metaData: metaData,
        gameUrl: gameUrl,
      })
      toast.success('Buy successfully!')
    } else if (
      PlayerBuyGameItemStatus.data?.resultCode == ResultCode.ExistingItem
    ) {
      toast.error('Existing Item, Please buy another item!')
    } else if (
      PlayerBuyGameItemStatus.isError ||
      PlayerBuyGameItemStatus.data?.resultCode == ResultCode.Error ||
      PlayerBuyGameItemStatus.data?.resultCode == ResultCode.Invalid ||
      PlayerBuyGameItemStatus.data?.resultCode == ResultCode.Unknown ||
      PlayerBuyGameItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error('Error, Please try again!')
    }
  }, [PlayerBuyGameItemStatus])

  // get player item

  const [getPlayerItemList, getPlayerItemListStatus] =
    useGetPlayerGameItemsMutation()

  const [PlayerItemList, setPlayerItemList] = useState<UserGameItems[]>([])

  const [PLayerDeleteGameItem, PLayerDeleteGameItemStatus] =
    usePLayerDeleteGameItemMutation()
  const [PlayerEquipItem, PlayerEquipItemStatus] = usePlayerEquipItemMutation()

  useEffect(() => {
    getPlayerItemList({
      payload: { keywords: keyWords },
      gameUrl: gameUrl,
    })
  }, [])

  useEffect(() => {
    if (
      getPlayerItemListStatus.isSuccess &&
      getPlayerItemListStatus.data.resource != null
    ) {
      setPlayerItemList(getPlayerItemListStatus.data.resource)
    }
  }, [getPlayerItemListStatus])

  const handleEquipItem = (item: UserGameItems) => {
    showConfirmModal({
      message: `Are you sure you want equip "${item.itemInfo.name}"? You need to log out game before clicking equip button!`,
      onConfirm: () => {
        PlayerEquipItem({ payload: { userItemId: item.id }, gameUrl: gameUrl })
      },
    })
  }

  useEffect(() => {
    if (
      PlayerEquipItemStatus.data &&
      PlayerEquipItemStatus.data.resultCode == ResultCode.Success
    ) {
      getPlayerItemList({
        payload: { keywords: keyWords },
        gameUrl: gameUrl,
      })
      toast.success('Equip Item Successfully!')
    } else if (
      PlayerEquipItemStatus.isError ||
      PlayerEquipItemStatus.data?.resultCode == ResultCode.Error ||
      PlayerEquipItemStatus.data?.resultCode == ResultCode.Invalid ||
      PlayerEquipItemStatus.data?.resultCode == ResultCode.Unknown ||
      PlayerEquipItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error('Error, Please try again!')
    }
  }, [PlayerEquipItemStatus])

  const handleDeleteItem = (item: UserGameItems) => {
    showConfirmModal({
      message: `Are you sure you want delete "${item.itemInfo.name}"? `,
      onConfirm: () => {
        PLayerDeleteGameItem({
          payload: { userItemId: item.id },
          gameUrl: gameUrl,
        })
      },
    })
  }

  useEffect(() => {
    if (
      PLayerDeleteGameItemStatus.data &&
      PLayerDeleteGameItemStatus.data.resultCode == ResultCode.Success
    ) {
      getPlayerItemList({
        payload: { keywords: keyWords },
        gameUrl: gameUrl,
      })
      toast.success('Deleted Item!')
    } else if (
      PLayerDeleteGameItemStatus.isError ||
      PLayerDeleteGameItemStatus.data?.resultCode == ResultCode.Error ||
      PLayerDeleteGameItemStatus.data?.resultCode == ResultCode.Invalid ||
      PLayerDeleteGameItemStatus.data?.resultCode == ResultCode.Unknown ||
      PLayerDeleteGameItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error('Error, Please try again!')
    }
  }, [PLayerDeleteGameItemStatus])

  return (
    <>
      {(GetPlayerInfoStatus.isLoading ||
        getItemListStatus.isLoading ||
        PlayerBuyGameItemStatus.isLoading) && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-md-6'>
                <h4 className='card-header-title text-dark'>
                  Your In-game bank:&nbsp;
                  {currentPlayer?.bankAmount.toLocaleString()}
                </h4>
              </div>
              <div className='col-md-6'>
                <h4 className='card-header-title text-dark'>
                  Your Class:&nbsp;
                  {currentPlayer?.class}
                </h4>
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-12'>
                <h4>
                  Your items (You can only equip each item one time a day)
                </h4>
                <div className='row row-cols-1 row-cols-md-3 g-2 mt-5'>
                  {PlayerItemList.map((pitem) => (
                    <div key={v4()} className='col'>
                      <div className='card h-100'>
                        <div className='text-center mt-2  '>
                          <img
                            className='avatar avatar-lg  '
                            src={pitem.itemInfo.images}
                          />
                        </div>
                        <div className='card-body'>
                          <h5 className='card-title'>{pitem.itemInfo.name}</h5>
                          <div>Class: {pitem.itemInfo.class}</div>
                          <div>
                            Type: {GetTypeNameOfItem(pitem.itemInfo.type)}
                          </div>
                          <div>
                            Expire Date:
                            {dayjs(pitem.expiredDate).format('DD/MM/YYYY')}
                          </div>

                          <div className='text-center mt-2'>
                            {!pitem.equipped && (
                              <a
                                href='#'
                                onClick={() => {
                                  if (
                                    currentPlayer?.class ==
                                      pitem.itemInfo.class ||
                                    pitem.itemInfo.class.toLowerCase() == 'all'
                                  ) {
                                    handleEquipItem(pitem)
                                  } else {
                                    showDialogModal({
                                      message:
                                        'Please change your class before equip this item!',
                                    })
                                  }
                                }}
                                className='btn btn-sm btn-primary'
                              >
                                Equip
                              </a>
                            )}
                            {pitem.equipped && (
                              <a
                                href='#'
                                className='btn disabled btn-sm btn-primary'
                              >
                                Equipped
                              </a>
                            )}
                            <a
                              href='#'
                              onClick={() => {
                                handleDeleteItem(pitem)
                              }}
                              className='btn btn-sm btn-danger ms-2'
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='row mt-5'>
              <div className='col-md-12'>
                <h4>HighShop items</h4>
                <div className='row row-cols-1 row-cols-md-3 g-2 mt-5'>
                  {ShopItemList.map((sitem) => (
                    <div key={v4()} className='col'>
                      <div className='card h-100'>
                        <div className='text-center mt-2  '>
                          <img
                            className='avatar avatar-lg  '
                            src={sitem.images}
                          />
                        </div>
                        <div className='card-body'>
                          <h5 className='card-title'>{sitem.name}</h5>
                          <div>Class: {sitem.class}</div>
                          <div>Type: {sitem.type}</div>
                          <div>Stock: {sitem.stock}</div>
                          <div>Price: {sitem.price}</div>
                          <div>Duration: {sitem.duration} days</div>
                          <p className='card-text'>{sitem.description}</p>
                          <div className='text-center'>
                            <a
                              href='#'
                              onClick={() => {
                                if (currentPlayer?.bankAmount >= sitem.price) {
                                  handleBuyItem(sitem)
                                } else {
                                  showDialogModal({
                                    message:
                                      'You don`t enough money, Please check your In-game bank account!',
                                  })
                                }
                              }}
                              className='btn btn-sm btn-primary'
                            >
                              Buy
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div>
                  <Pagination
                    totalRows={totalShopItemRows}
                    pagingData={pagingData}
                    pageChangeEvent={pagingChangeEvent}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserGame
