import React, { useState, useRef, useEffect } from 'react'
import '../App.css'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import RangeSlider from 'react-bootstrap-range-slider'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'

export default function PaintCanvas () {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [drawFlg, setDrawFlg] = useState(false)

  const colors = ['black', 'lightgray', 'tomato', 'royalblue', 'lightskyblue', 'khaki', 'forestgreen', 'orange', 'plum', 'white' ]
  const [lineWid, setLineWid] = useState(2)
  const [shadowBlur, setShadowBlur] = useState(0)
  const width = 500
  const height = 400
  const canvasDesign = ['plane',　'parchment']
  const [designBack, setDesignBack] = useState('plane')

  // canvas設定
  useEffect(() => {
    console.log('useEffect')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    contextRef.current = ctx
  }, [])

  // 描画開始
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setDrawFlg(true)
  }

  // 描画中
  const drawing = ({ nativeEvent }) => {
    if(!drawFlg){
      return
    }
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }
  
  // 描画終了
  const finishDrawing = () => {
    contextRef.current.closePath()
    setDrawFlg(false)
  }

  // クリアボタン
  const handleClear = () => {
    contextRef.current.clearRect(0, 0, width, height)
  }

  // 色変更
  const handleColorChange = (clr) => {
    contextRef.current.globalCompositeOperation = 'source-over'
    contextRef.current.strokeStyle = clr
  }

  // 線の太さ
  const handleLineChange = e => {
    contextRef.current.lineWidth = e.target.value
    setLineWid(e.target.value)
  }

  // 消しゴム機能
  const handleEraser = () => {
    contextRef.current.globalCompositeOperation = 'destination-out'
  }

  // 線の影
  const handleShadowBlur = e => {
    contextRef.current.shadowColor = "gray"
    setShadowBlur(e.target.value)
    contextRef.current.shadowBlur = e.target.value
  }

  const handleSaveClick = () => {
    const cvs = document.getElementById('myCanvas')
    const dataURL = cvs.toDataURL()
    console.log('dataURL: ', dataURL)
    const newImg = document.createElement('a')
    document.body.appendChild(newImg)
    newImg.download = `image-${Date.now()}.png`
    newImg.href = dataURL
    newImg.click()
    newImg.remove()
  }

  return (
    <div>
      <h1>Let's Painting!!</h1>
      <div>
        {colors.map((clr) => {
          return (
            <button
              key={clr}
              style={{backgroundColor: clr}}
              onClick={() => handleColorChange(clr)}
            >
            {clr}
            </button>
          )
        })}
        <button onClick={() => handleEraser()}>Eraser</button>
        <table><tbody>
          <tr>
            <td>line thickness</td>
            <td>{lineWid}</td>
            <td>
              <RangeSlider
                min={Number(1)}
                max={Number(20)}
                value={lineWid}
                onChange={(e) => handleLineChange(e)}
              />
            </td>
          </tr>
          <tr>
            <td>shadow blur</td>
            <td>{shadowBlur}</td>
            <td>
              <RangeSlider
                min={Number(0)}
                max={Number(10)}
                value={shadowBlur}
                onChange={(e) => handleShadowBlur(e)}
              />
            </td>
          </tr>
        </tbody></table>
        <select value={designBack} onChange={e => setDesignBack(e.target.value)}>
          {canvasDesign.map((design) => {
            return (
              <option key={design} value={design}>{design}</option>
            )
          })}
        </select>
      </div>

      <canvas
        id="myCanvas"
        ref={canvasRef}
        className={designBack}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={drawing}
        onMouseLeave={finishDrawing}
      />

      <p>※次のページへ行く前に必ず保存してください。(消えます！！！)</p>
      <div>
        <Button variant="outline-primary" onClick={() => handleSaveClick()}>Save</Button>
        <Button variant="outline-danger" onClick={() => handleClear()}>Clear</Button>
        <Button variant="primary" onClick={() => {console.log('Clicked Complete!')}}>Complete</Button>
      </div>
    </div>
  )
}