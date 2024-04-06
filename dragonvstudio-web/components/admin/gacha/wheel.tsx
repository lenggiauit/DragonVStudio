import { EventPlayer } from '@/services/models/adminGame/eventPlayer'
import { GachaItem } from '@/services/models/adminGame/gachaItem'
import { GetRandomBgColor } from '@/utils/functions'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { number } from 'yup'

type Props = {
  gachaItems: GachaItem[]
  winningSegment: any
  onStart: () => void
  onFinished: (winner: GachaItem) => void
  primaryColor: any
  primaryColoraround: any
  contrastColor: any
  buttonText: any
  isOnlyOnce: boolean
  size: number
  upDuration?: number
  downDuration?: number
  fontFamily?: string
}

export interface CanReDraw {
  ReDraw(): void
}

const WheelSpin = forwardRef<CanReDraw, Props>(
  (
    {
      gachaItems,
      winningSegment,
      onStart,
      onFinished,
      primaryColor,
      primaryColoraround,
      contrastColor,
      buttonText,
      isOnlyOnce = true,
      size,
      upDuration = 1000,
      downDuration = 100,
      fontFamily = 'proxima-nova',
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      ReDraw() {
        wheelDraw()
      },
    }))
    let segColors: string[] = Array.from({ length: 26 }, (_, i) =>
      GetRandomBgColor()
    )
    let currentSegment: GachaItem
    let isStarted = false
    const [isFinished, setFinished] = useState(false)
    let timerHandle: any = 0
    const timerDelay = gachaItems.length
    let angleCurrent = 0
    let angleDelta = 0
    let canvasContext: CanvasRenderingContext2D | null
    let maxSpeed = Math.PI / gachaItems.length
    const upTime = gachaItems.length * upDuration
    const downTime = gachaItems.length * downDuration
    let spinStart = 0
    let frames = 0
    const centerX = size + 25
    const centerY = size + 25

    useEffect(() => {
      wheelInit()
      setTimeout(() => {
        window.scrollTo(0, 1)
      }, 0)
    }, [])
    const wheelInit = () => {
      initCanvas()
      wheelDraw()
    }

    const initCanvas = () => {
      let canvas = document.getElementById('canvas') as HTMLCanvasElement

      if (navigator.appVersion.indexOf('MSIE') !== -1) {
        canvas = document.createElement('canvas')
        canvas.setAttribute('width', size.toString())
        canvas.setAttribute('height', size.toString())
        canvas.setAttribute('id', 'canvas')
        document.getElementById('wheel')?.appendChild(canvas)
      }
      if (canvas) {
        canvas.addEventListener('click', spin, false)
        canvasContext = canvas.getContext('2d')
      }
    }

    const spin = () => {
      onStart()
      var sound = new Audio('/static/audio/spin-whoosh.mp3')
      sound.preload = 'auto'
      sound.load()
      sound.play()
      isStarted = true
      // onRotate();
      if (timerHandle === 0) {
        spinStart = new Date().getTime()
        // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
        maxSpeed = Math.PI / gachaItems.length
        frames = 0
        timerHandle = setInterval(onTimerTick, timerDelay)
      }
    }
    const onTimerTick = () => {
      frames++
      draw()
      const duration = new Date().getTime() - spinStart
      let progress = 0
      let finished = false
      if (duration < upTime) {
        progress = duration / upTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
      } else {
        if (winningSegment) {
          if (currentSegment === winningSegment && frames > gachaItems.length) {
            progress = duration / upTime
            angleDelta =
              maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
            progress = 1
          } else {
            progress = duration / downTime
            angleDelta =
              maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          }
        } else {
          progress = duration / downTime
          if (progress >= 0.8) {
            angleDelta =
              (maxSpeed / 1.2) *
              Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          } else if (progress >= 0.98) {
            angleDelta =
              (maxSpeed / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          } else
            angleDelta =
              maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        }
        if (progress >= 1) finished = true
      }

      angleCurrent += angleDelta
      while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2
      if (finished) {
        var sound = new Audio('/static/audio/goodresult.mp3')
        sound.preload = 'auto'
        sound.load()
        sound.play()
        setFinished(true)
        onFinished(currentSegment)
        clearInterval(timerHandle)
        timerHandle = 0
        angleDelta = 0
      }
    }

    const wheelDraw = () => {
      clear()
      drawWheel()
      drawNeedle()
    }

    const draw = () => {
      clear()
      drawWheel()
      drawNeedle()
    }

    const drawSegment = (key: any, lastAngle: any, angle: any) => {
      const ctx = canvasContext
      const value = gachaItems[key].name
      if (ctx) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, size, lastAngle, angle, false)
        ctx.lineTo(centerX, centerY)
        ctx.closePath()
        ctx.fillStyle = segColors[key]
        ctx.fill()
        ctx.stroke()
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((lastAngle + angle) / 2)
        ctx.fillStyle = contrastColor || 'white'
        ctx.font = 'bold 1em ' + fontFamily
        ctx.fillText(value.substr(0, 21), size / 2 + 10, 0)
        ctx.restore()
      }
    }

    const drawWheel = () => {
      const ctx = canvasContext
      let lastAngle = angleCurrent
      const len = gachaItems.length
      const PI2 = Math.PI * 2
      if (ctx) {
        ctx.lineWidth = 1
        ctx.strokeStyle = primaryColor || 'black'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.font = '1em ' + fontFamily
        for (let i = 1; i <= len; i++) {
          const angle = PI2 * (i / len) + angleCurrent
          drawSegment(i - 1, lastAngle, angle)
          lastAngle = angle
        }

        // Draw a center circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, 42, 0, PI2, false)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.lineWidth = 5
        ctx.strokeStyle = primaryColoraround
        ctx.fill()
        ctx.font = 'bold 2em ' + fontFamily
        ctx.fillStyle = contrastColor || 'white'
        ctx.textAlign = 'center'

        var img = new Image()
        img.onload = function () {
          ctx.drawImage(img, centerX - 32, centerY - 32) // Or at whatever offset you like
        }
        img.src = '/static/images/Logo64x64.png'
        img.role = 'button'
        ctx.stroke()

        // Draw outer circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, size, 0, PI2, false)
        ctx.closePath()
        ctx.lineWidth = 12
        ctx.strokeStyle = primaryColoraround || 'white'
        ctx.stroke()
      }
    }

    const drawNeedle = () => {
      const ctx = canvasContext
      if (ctx) {
        ctx.lineWidth = 1
        ctx.strokeStyle = primaryColoraround // contrastColor || 'white'
        ctx.fillStyle = primaryColoraround //contrastColor || 'white'
        ctx.beginPath()
        ctx.moveTo(centerX + 10, centerY - 42)
        ctx.lineTo(centerX - 10, centerY - 42)
        ctx.lineTo(centerX, centerY - 60)
        ctx.closePath()
        ctx.fill()
        const change = angleCurrent + Math.PI / 2
        let i =
          gachaItems.length -
          Math.floor((change / (Math.PI * 2)) * gachaItems.length) -
          1
        if (i < 0) i = i + gachaItems.length
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'transparent'
        ctx.font = 'bold 1.5em ' + fontFamily
        currentSegment = gachaItems[i]
        isStarted &&
          ctx.fillText(currentSegment.name, centerX + 10, centerY + size + 50)
      }
    }
    const clear = () => {
      canvasContext?.clearRect(0, 0, 1000, 800)
    }
    return (
      <>
        <div
          id='wheel'
          className='d-flex align-items-center justify-content-center'
        >
          <canvas
            id='canvas'
            role='button'
            width={(size + 25) * 2}
            height={(size + 25) * 2}
            style={{
              pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto',
            }}
          />
        </div>
      </>
    )
  }
)

export default WheelSpin
