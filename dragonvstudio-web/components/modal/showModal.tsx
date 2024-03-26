'use client'
import React, { ReactElement } from 'react'
import { Translation } from '../translation'
import { Root, createRoot } from 'react-dom/client'

const pmModalDialogId = 'pm-modal-dialog'
type Props = {
  options: PropTypes
}
var root: Root
const ShowModal: React.FC<Props> = ({ options }) => {
  const removeModalComponent = (): void => {
    root?.unmount()
  }
  const onCloseHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    removeModalComponent()
    if (options.onClose) options.onClose()
  }
  return (
    <>
      <div
        className='modal fade show '
        style={{ display: 'block' }}
        role='dialog'
        aria-modal='true'
      >
        <div
          className={`modal-dialog ${
            options.size === undefined ? '' : options.size
          } modal-dialog-scrollable modal-dialog-centered`}
          role='document'
        >
          <div className='modal-content'>
            {options.title && (
              <>
                <div className='modal-header'>
                  <h5 className='modal-title text-dark' id='exampleModalLabel'>
                    {options.title}
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                    onClick={onCloseHandler}
                  ></button>
                </div>
              </>
            )}
            <div className='modal-body pb-2'>
              <p className='m-0 text-wrap text-break' style={{ width: '100%' }}>
                {options.message}
              </p>
            </div>
            <div className='modal-footer border-0'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={onCloseHandler}
                data-dismiss='modal'
              >
                <Translation tid='btnClose' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

type PropTypes = {
  title?: any
  message: any
  size?: any
  onClose?: () => void
}

const showDialogModal = (options: PropTypes) => {
  let divTarget = document.getElementById(pmModalDialogId)
  if (divTarget) {
    root = createRoot(divTarget)
    root.render(<ShowModal options={options} />)
  } else {
    divTarget = document.createElement('div')
    divTarget.id = pmModalDialogId
    document.body.appendChild(divTarget)
    root = createRoot(divTarget)
    root.render(<ShowModal options={options} />)
  }
}

export default showDialogModal
