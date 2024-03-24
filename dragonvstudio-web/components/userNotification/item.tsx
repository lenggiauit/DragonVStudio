import React, { useEffect } from 'react'
import { useAppContext } from '../../contexts/appContext'
import { dictionaryList } from '../../locales'
import { useRemoveMutation } from '../../services/notification'
import { NotificationResource } from '../../services/resources/notificationResource'
import { ResultCode } from '@/utils/enums'
import { toast } from 'react-toastify'

type Props = {
  dataItem: NotificationResource
  onDelete: (dataItem: NotificationResource) => void
}

const NotificationItem: React.FC<Props> = ({ dataItem, onDelete }) => {
  const { locale, setLocale } = useAppContext()
  const [removeNotify, { isLoading, data, error }] = useRemoveMutation()

  useEffect(() => {
    if (data && data.resource == ResultCode.Success) {
      toast.success(dictionaryList[locale]['UpdatedSuccessfully'])
    }
  }, [data])

  return (
    <>
      <div className='alert alert-info d-flex align-items-center' role='alert'>
        <div className='row w-100'>
          <div className='col-md-10'>
            {dictionaryList[locale][dataItem.message] == null
              ? dataItem.message
              : dictionaryList[locale][dataItem.message]}
          </div>
          <div className='col-md-2 text-end'>
            <a
              href='#'
              className='btn btn-close'
              style={{ zIndex: 10 }}
              onClick={(e) => {
                removeNotify({ payload: dataItem.id })
                onDelete(dataItem)
              }}
            ></a>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationItem
