import React, { useState, useRef, useEffect } from 'react'
import '../App.css'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import RangeSlider from 'react-bootstrap-range-slider'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

export default function PaintCanvas () {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [drawFlg, setDrawFlg] = useState(false)

  // const colors = ['black', 'lightgray', 'tomato', 'royalblue', 'lightskyblue', 'khaki', 'forestgreen', 'orange', 'plum', 'white' ]
  const [lineWid, setLineWid] = useState(2)
  const [shadowBlur, setShadowBlur] = useState(0)
  const width = 500
  const height = 400
  const canvasDesign = ['plane',　'parchment']
  const [designBack, setDesignBack] = useState('plane')
  const [shadowColor, setShadowColor] = useState('#000000')
  const [lineColor, setLineColor] = useState('#000000')
  const [eraserFlg, setEraserFlg] = useState('OFF')

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
    contextRef.current.shadowColor = "#000000"
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

  // 線の色
  const handleLineColor = (e) => {
    contextRef.current.globalCompositeOperation = 'source-over'
    contextRef.current.strokeStyle = e.target.value
    setLineColor(e.target.value)
  }

  // 線の幅
  const handleLineChange = e => {
    contextRef.current.lineWidth = e.target.value
    setLineWid(e.target.value)
  }

  // 線の影
  const handleShadowBlur = e => {
    setShadowBlur(e.target.value)
    contextRef.current.shadowBlur = e.target.value
  }

  // 線の影色
  const handleShadowColor = e => {
    contextRef.current.shadowColor = e.target.value
    setShadowColor(e.target.value)
  }

  // 消しゴム機能
  const handleSetEraser = () => {
    if (eraserFlg === 'OFF') {
      contextRef.current.globalCompositeOperation = 'destination-out'
      setEraserFlg('ON')
    } else if (eraserFlg === 'ON') {
      contextRef.current.globalCompositeOperation = 'source-over'
      setEraserFlg('OFF')
      return
    }
  }

  // 画像の保存
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
        <button onClick={() => handleSetEraser()}><FontAwesomeIcon style={{padding: 5, fontSize: 30}} icon={faEraser} /></button>
        <p>ERASER STATUS: {eraserFlg}</p>
        <table><tbody>
          <tr>
            <td>Line</td>
            <td>{lineWid}</td>
            <td>
              <RangeSlider
                min={Number(1)}
                max={Number(20)}
                value={lineWid}
                onChange={(e) => handleLineChange(e)}
              />
            </td>
            <td><input type="color" value={lineColor} onChange={(e) => handleLineColor(e)} /></td>
          </tr>
          <tr>
            <td>Shadow</td>
            <td>{shadowBlur}</td>
            <td>
              <RangeSlider
                min={Number(0)}
                max={Number(10)}
                value={shadowBlur}
                onChange={(e) => handleShadowBlur(e)}
              />
            </td>
            <td><input type="color" value={shadowColor} onChange={(e) => handleShadowColor(e)} /></td>
          </tr>
          <tr>
            <td>Background</td>
            <td></td>
            <td>
              <select value={designBack} onChange={e => setDesignBack(e.target.value)}>
                {canvasDesign.map((design) => {
                  return (
                    <option key={design} value={design}>{design}</option>
                  )
                })}
              </select>
            </td>
          </tr>
        </tbody></table>
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

      {/* <p>※次のページへ行く前に必ず保存してください。(消えます！！！)</p> */}
      <div>
        <Button variant="outline-primary" onClick={() => handleSaveClick()}>Save</Button>
        <Button variant="outline-danger" onClick={() => handleClear()}>Clear</Button>
        {/* <Button variant="primary" onClick={() => {console.log('Clicked Complete!')}}>Complete</Button> */}
      </div>
    </div>
  )
}