import cv, { Mat } from 'opencv-ts'

interface Point {
  x: number,
  y: number
}

export const findPaperContour = (img: Mat) => {
  const imgGray = new cv.Mat()
  cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY)

  const imgBlur = new cv.Mat();
  cv.GaussianBlur(
    imgGray,
    imgBlur,
    new cv.Size(5, 5),
    0,
    0,
    cv.BORDER_DEFAULT
  )

  const imgThresh = new cv.Mat()
  cv.threshold(
    imgBlur,
    imgThresh,
    0,
    255,
    cv.THRESH_BINARY + cv.THRESH_OTSU
  )

  let contours = new cv.MatVector()
  let hierarchy = new cv.Mat()

  cv.findContours(
    imgThresh,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  )

  let maxArea = 0
  let maxCountourIndex = -1
  for (let i = 0; i < contours.size(); ++i) {
    let contourArea = cv.contourArea(contours.get(i))
    if (contourArea > maxArea) {
      maxArea = contourArea
      maxCountourIndex = i
    }
  }

  const maxContour = contours.get(maxCountourIndex)

  imgGray.delete()
  imgBlur.delete()
  imgThresh.delete()
  contours.delete()
  hierarchy.delete()
  return maxContour
}

export const extractPaper = (image: HTMLImageElement): HTMLCanvasElement | null => {
  const canvas = document.createElement('canvas')

  const img = cv.imread(image)

  const maxContour = findPaperContour(img)

  const {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  } = getCornerPoints(maxContour)

  if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
    return null
  }

  let warpedDst = new cv.Mat()

  const resultWidth = 255
  const resultHeight = 255

  let dsize = new cv.Size(resultWidth, resultHeight)
  let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    topLeft.x,
    topLeft.y,
    topRight.x,
    topRight.y,
    bottomLeft.x,
    bottomLeft.y,
    bottomRight.x,
    bottomRight.y,
  ])

  let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    resultWidth,
    0,
    0,
    resultHeight,
    resultHeight,
    resultHeight
  ])

  let M = cv.getPerspectiveTransform(srcTri, dstTri)
  cv.warpPerspective(
    img,
    warpedDst,
    M,
    dsize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  )

  cv.imshow(canvas, warpedDst)

  img.delete()
  warpedDst.delete()
  return canvas
}

export const highlightPaper = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const img = cv.imread(image)

  const maxContour = findPaperContour(img)
  cv.imshow(canvas, img)
  if (maxContour) {
    const {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    } = getCornerPoints(maxContour)

    if (topLeft && topRight && bottomLeft && bottomRight) {
      ctx.strokeStyle = 'orange'
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.moveTo(topLeft.x, topLeft.y)
      ctx.moveTo(topRight.x, topRight.y)
      ctx.moveTo(bottomLeft.x, bottomLeft.y)
      ctx.moveTo(bottomRight.x, bottomRight.y)
      ctx.stroke()
    }
  }

  img.delete()
  return canvas
}

export const getCornerPoints = (contour: Mat) => {
  let rect = cv.minAreaRect(contour)
  const center = rect.center

  let topLeft
  let topLeftDist = 0

  let topRight
  let topRightDist = 0

  let bottomLeft
  let bottomLeftDist = 0

  let bottomRight
  let bottomRightDist = 0

  for (let i = 0; i < contour.data32S.length; i += 2) {
    const point = { x: contour.data32S[i], y: contour.data32S[i + 1] }
    const dist = distance(point, center)
    if (point.x < center.x && point.y < center.y) {
      if (dist > topLeftDist) {
        topLeft = point
        topLeftDist = dist
      }
    } else if (point.x > center.x && point.y < center.y) {
      if (dist > topRightDist) {
        topRight = point
        topRightDist = dist
      }
    } else if (point.x < center.x && point.y > center.y) {
      if (dist > bottomLeftDist) {
        bottomLeft = point
        bottomLeftDist = dist
      }
    } else if (point.x > center.x && point.y > center.y) {
      if (dist > bottomRightDist) {
        bottomRight = point
        bottomRightDist = dist
      }
    }
  }

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  }
}

export const distance = (p1: Point, p2: Point) => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}