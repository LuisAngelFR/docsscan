from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Response
from fastapi.responses import StreamingResponse

import numpy as np
import cv2

from scan_doc import scan_doc

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=['*'],
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)

@app.post('/scan-doc')
async def scan_doc_route(img: UploadFile = File(...)):
  last_point = img.filename.rfind('.')
  filename = img.filename[:last_point]
  img_content = await img.read()

  img_np = np.frombuffer(img_content, np.uint8)
  img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

  try:
    img, pdf = scan_doc(img)

    return {
      'preview': img,
      'pdf': pdf,
      'filename': filename,
    }
  except:
    return Response(status_code=500)