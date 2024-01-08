import numpy as np
import img2pdf
import base64
import cv2

def scan_doc(img):
  img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  img_blur = cv2.GaussianBlur(img_gray, (5, 5), 0, 0, cv2.BORDER_DEFAULT)
  _, img_thresh = cv2.threshold(img_blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

  contours, _ = cv2.findContours(img_thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)

  max_contour = max(contours, key=cv2.contourArea)

  rect = cv2.minAreaRect(max_contour)
  center = rect[0]

  corners = {'topLeftCorner': None, 'topRightCorner': None, 'bottomLeftCorner': None, 'bottomRightCorner': None}
  distances = {'topLeftCorner': 0, 'topRightCorner': 0, 'bottomLeftCorner': 0, 'bottomRightCorner': 0}

  for i in range(len(max_contour)):
          point = tuple(max_contour[i][0])
          dist = np.linalg.norm(np.array(point) - np.array(center))

          if point[0] < center[0] and point[1] < center[1]:
              if dist > distances['topLeftCorner']:
                  corners['topLeftCorner'] = {'x': point[0], 'y': point[1]}
                  distances['topLeftCorner'] = dist
          elif point[0] > center[0] and point[1] < center[1]:
              if dist > distances['topRightCorner']:
                  corners['topRightCorner'] = {'x': point[0], 'y': point[1]}
                  distances['topRightCorner'] = dist
          elif point[0] < center[0] and point[1] > center[1]:
              if dist > distances['bottomLeftCorner']:
                  corners['bottomLeftCorner'] = {'x': point[0], 'y': point[1]}
                  distances['bottomLeftCorner'] = dist
          elif point[0] > center[0] and point[1] > center[1]:
              if dist > distances['bottomRightCorner']:
                  corners['bottomRightCorner'] = {'x': point[0], 'y': point[1]}
                  distances['bottomRightCorner'] = dist

  src_tri = np.array([
      [corners['topLeftCorner']['x'], corners['topLeftCorner']['y']],
      [corners['topRightCorner']['x'], corners['topRightCorner']['y']],
      [corners['bottomLeftCorner']['x'], corners['bottomLeftCorner']['y']],
      [corners['bottomRightCorner']['x'], corners['bottomRightCorner']['y']]
  ], dtype=np.float32)

  result_width = corners['topRightCorner']['x'] - corners['topLeftCorner']['x']
  result_height = corners['bottomLeftCorner']['y'] - corners['topLeftCorner']['y']

  dst_tri = np.array([
    [0, 0],
    [result_width, 0],
    [0, result_height],
    [result_width, result_height]
  ], dtype=np.float32)

  M = cv2.getPerspectiveTransform(src_tri, dst_tri)
  warped_dst = cv2.warpPerspective(img, M, (result_width, result_height))

  _, buffer = cv2.imencode('.jpg', warped_dst)

  img_bytes = buffer.tobytes()
  img_base64 = base64.b64encode(img_bytes).decode('utf-8')

  pdf_data = img2pdf.convert(img_bytes)

  pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')

  return img_base64, pdf_base64