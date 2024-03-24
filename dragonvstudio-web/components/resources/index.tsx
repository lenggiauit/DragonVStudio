'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { useAppContext } from '../../contexts/appContext'
import * as Yup from 'yup'
import { dictionaryList } from '../../locales'
import { useEffect, useState } from 'react'
import { Translation } from '../translation'
import { AppSetting, MetaData, Paging } from '../../types/type'
import { FileSharingResource } from '../../services/resources/fileSharingResource'
import { useGetFileSharingMutation } from '../../services/fileService'
import LocalSpinner from '../localSpinner'
import Pagination from '../pagination'
import NotFound from '../notFound'
import { v4 } from 'uuid'
import { useQuery } from '../../utils/functions'
let appSetting: AppSetting = require('../../appSetting.json')

type FormValues = {
  keywords: string
}

const Resources: React.FC = () => {
  let query = useQuery()

  let initialValues: FormValues = {
    keywords: '',
  }

  const validationSchema = () => {
    return Yup.object().shape({
      keywords: Yup.string().max(20),
    })
  }

  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    setKeyWords(values.keywords)
  }

  const [keyWords, setKeyWords] = useState<string | null>(query.get('s'))
  const [getFileSharingList, getFileSharingStatus] = useGetFileSharingMutation()
  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)
  const [fileSharingList, setFileSharingList] = useState<FileSharingResource[]>(
    []
  )

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
    getFileSharingList({ payload: { keywords: keyWords }, metaData: metaData })
  }, [metaData, keyWords])

  useEffect(() => {
    if (
      getFileSharingStatus.isSuccess &&
      getFileSharingStatus.data.resource != null
    ) {
      let data = getFileSharingStatus.data.resource
      if (data.length > 0) {
        setTotalRows(data[0].totalRows)
      } else {
        setTotalRows(0)
      }
      setFileSharingList(data)
    }
  }, [getFileSharingStatus])

  useEffect(() => {}, [])

  return (
    <>
      <div className='row'>
        <div className='col-md-6 mx-auto'>
          <Formik
            initialValues={initialValues}
            onSubmit={handleOnSubmit}
            validationSchema={validationSchema}
            validateOnChange={false}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form autoComplete='off' className='input-round'>
                <div className='form-group input-group'>
                  <Field
                    type='text'
                    className='form-control form-control-sm'
                    name='keywords'
                    placeholder='search keywords'
                    maxLength='50'
                  />
                  <div className='input-group-append'>
                    <button className='btn btn-primary' type='submit'>
                      <Translation tid='btn_search' />
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className='row '>
        <div className='col-md-12 mt-4'>
          {getFileSharingStatus.isLoading && <LocalSpinner />}
          {Array.from(
            new Set(fileSharingList.map((item) => item.category))
          ).map((category, index) => (
            <div key={v4()}>
              {index > 0 ? <hr className='hr-dash my-3' /> : ''}

              <h3>{category}</h3>
              <br />
              <div className='row'>
                {fileSharingList
                  .filter((f) => f.category == category)
                  .map((file) => (
                    <div key={v4()} className='col-md-6'>
                      <h6>
                        <i
                          className='bi bi-file-text me-2'
                          style={{ fontSize: 18 }}
                        ></i>
                        <a target='_blank' href={file.url}>
                          {file.name.length > 100
                            ? file.name.substring(0, 100)
                            : file.name}
                        </a>
                      </h6>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          {getFileSharingStatus.isSuccess && fileSharingList.length == 0 && (
            <NotFound />
          )}
        </div>
      </div>
      <Pagination
        totalRows={totalRows}
        pagingData={pagingData}
        pageChangeEvent={pagingChangeEvent}
      />
      <br />
      <br />
      <div
        className='row rounded bg-img p-7'
        style={{ backgroundImage: `url(../../assets/images/bg.jpg)` }}
      >
        <div className='col-md-6'>
          <a
            href='/private-talk'
            className='btn btn-block btn-glass btn-primary'
          >
            Đăng ký Private talk
          </a>
        </div>
        <div className='col-md-6'>
          <a
            href='/mock-interview'
            className='btn btn-block btn-glass btn-success'
          >
            Đăng ký Mock interview{' '}
          </a>
        </div>
      </div>
    </>
  )
}

export default Resources
