import asyncio
import io
import pytest
from fastapi import UploadFile, HTTPException
from app.services.import_export.spreadsheet import read_upload, write_rows

@pytest.mark.parametrize('format',['csv','xlsx'])
def test_spreadsheet_roundtrip(format):
    data,_=write_rows(format,['name','status'],[{'name':'Example','status':'ACTIVE'}])
    actual,rows,headers=asyncio.run(read_upload(UploadFile(filename=f'example.{format}',file=io.BytesIO(data))))
    assert actual==format
    assert headers==['name','status']
    assert rows==[{'name':'Example','status':'ACTIVE'}]

def test_rejects_unsupported_files():
    with pytest.raises(HTTPException):
        asyncio.run(read_upload(UploadFile(filename='file.exe',file=io.BytesIO(b'bad'))))
