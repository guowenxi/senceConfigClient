import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import React, { useState } from 'react';
import { baseUrl } from '../../http';
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};


const App = ({ value, onChange  }) => {
  const [loading, setLoading] = useState(false);
  const [FILELIST, setFILELIST] = useState(value ? [
    {
      name:'0',
      url:value
    }
  ] : []);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    const url = window.URL.createObjectURL(file);
    // setImageUrl(url);
    return file;
    onChange(url)
    // return isJpgOrPng && isLt2M;
    // return false;
  
  };
  const handleChange= (info) => {
    const files = info.fileList;
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      setLoading(false);
      // very stupid url 
      const url = `${baseUrl}/${info.file.response.data[0]}.${info.file.type.split('/')[1]}`;
      onChange(url)
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, url => {
      //   // setImageUrl(url);
      // });
    }
    setFILELIST([...files]);
  };
  const handleRemove= (info) => {
    onChange(null)
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>选择图片</div>
    </div>
  );

  return (
    <Upload
      maxCount={1}
      listType="picture-card"
      className="avatar-uploader"
      action={`${baseUrl}/file/uploadFile`}
      isImageUrl={(file)=>{
        return <img src={value}></img>
      }}
      fileList={FILELIST}
      // previewFile={(file)=>{
      //   // return New Promise(function(resolve){
      //   //   resolve(file)
      //   // });
      // }}
      // showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      onRemove={handleRemove}
    >
      {value ? null : uploadButton}
    </Upload>
  );
};

export default App;