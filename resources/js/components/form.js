import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import FormData from 'form-data';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {image64toCanvasRef, downloadBase64File, extractImageFileExtensionFromBase64, base64StringtoFile} from './ReusableUtils.js';

class Form extends Component {
    constructor(props){
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
        this.state = {
            imgSrc: null,
            crop: {
              unit: "%",
              width: 30,
              aspect: 16 / 9
            }
        }

        this.onSelectFile = this.onSelectFile.bind(this);
        this.handleOnCropChange = this.handleOnCropChange.bind(this);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.handleOnCropComplete = this.handleOnCropComplete.bind(this);
        this.handleDownloadClick = this.handleDownloadClick.bind(this);
    }

    onSelectFile(e){
        e.preventDefault();
        // let currentFile = e.target.files[0];
        // if(window.FileReader){
        //     const reader = new FileReader();
        //     reader.addEventListener('load', () =>{
        //         console.log(reader.result);
        //         this.setState({
        //             imgSrc: reader.result
        //         })
        //     }, false )
        //     reader.readAsDataURL(currentFile)
        // }
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener("load", () =>
            this.setState({ imgSrc: reader.result })
          );
          reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleImageLoaded(image){
        // console.log(image);
        this.imageRef = image;
    }
    handleOnCropChange(crop){
        this.setState({crop:crop});
    }

    handleOnCropComplete(crop, pixelCrop){
        // console.log(crop, pixelCrop)
        // const canvasRef = this.imagePreviewCanvasRef.current
        // const {imgSrc}  = this.state
        // image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
        this.makeClientCrop(crop);
    }

    async makeClientCrop(crop) {
  if (this.imageRef && crop.width && crop.height) {
    const croppedImageUrl = await this.getCroppedImg(
      this.imageRef,
      crop,
      "newFile.jpeg"
    );
    this.setState({ croppedImageUrl });
  }
}

getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    resolve(canvas.toDataURL());
});

    // return new Promise((resolve, reject) => {
    //     canvas.toBlob(blob => {
    //       if (!blob) {
    //         //reject(new Error('Canvas is empty'));
    //         console.error("Canvas is empty");
    //         return;
    //       }
    //       blob.name = fileName;
    //       window.URL.revokeObjectURL(this.fileUrl);
    //       this.fileUrl = window.URL.createObjectURL(blob);
    //       resolve(this.fileUrl);
    //     }, "image/jpeg");
    //   });
    }

    handleDownloadClick(e){
        e.preventDefault();
        const {imgSrc, croppedImageUrl} = this.state;
        console.log(croppedImageUrl);
        const extention = extractImageFileExtensionFromBase64(imgSrc);
        console.log(extention);
        const fileName = "previewFile"+ extention;
        const newCroppedFile = base64StringtoFile(croppedImageUrl, fileName);
        console.log(newCroppedFile);
        downloadBase64File(croppedImageUrl, fileName);

        let form = new FormData();
        form.append('file', newCroppedFile);
        axios.post('/api/upload', form, {
            headers: {
              'accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.8',
              'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
            }
        })
        .then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log('error');
        });

    }

    render() {
        const {imgSrc, croppedImageUrl} = this.state;
        return (
            <div className="card">
                <div className="card-header display-4 text-center">Submit Project</div>
                <div className="card-body"><form autoComplete="off" onSubmit={this.handleCreateNewProject}>
                    <div className="form-group">
                        <label htmlFor="projectName">Project Name</label>
                        <input
                            id='name'
                            type="text"
                            name='projectName'
                            className="form-control"
                            placeholder="Project Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="projectBio">Project Bio</label>
                        <textarea
                            id='bio'
                            className="form-control"
                            name='projectBio'
                            rows='5'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="projectDescription">Project Description</label>
                        <textarea
                            id='projectDescription'
                            className="form-control"
                            name='projectDescription'
                            rows='5'
                        />
                    </div>

                        <div className="form-group">
                            <label>Main Project Image</label>
                            <div className="custom-file">
                                <input
                                    id="customFile"
                                    type="file"
                                    className="custom-file-input"
                                    onChange={this.onSelectFile}
                                />
                                <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                            </div>
                                {imgSrc !== null ?
                                    <div>

                                        <ReactCrop
                                            src={imgSrc}
                                            crop={this.state.crop}
                                            onChange={this.handleOnCropChange}
                                            onImageLoaded={this.handleImageLoaded}
                                            onComplete={this.handleOnCropComplete}
                                        />
                                    </div>

                                    :
                                    ''
                                }
                                {croppedImageUrl && (
                                  <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                                )}
                                {croppedImageUrl && (
                                    <button className="btn btn-block btn-info" onClick={this.handleDownloadClick}>Download</button>
                                )}


                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-block btn-primary">Submit</button>
                        </div>
</form>
                </div>
            </div>
        );
    }
}

export default Form;
