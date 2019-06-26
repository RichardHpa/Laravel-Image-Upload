import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class Modal extends Component {
    constructor(props){
        super(props);

        this.state = {
            crop: {
                x: 20,
                y: 10,
                width: 40,
                height: 40
            }
        }

        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.cropImage = this.cropImage.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
    }

    componentDidMount(e){
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal({show: true, backdrop: 'static', keyboard: false})
        $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
    }

    handleCloseClick(){
        $(this.modal).modal('hide');
        this.props.handleModalCloseClick();
    }

    onCropChange(crop){
        this.setState({ crop });
    }

    cropImage(){
        const { croppedImageUrl } = this.state;
        $(this.modal).modal('hide');
        this.props.croppedImage(croppedImageUrl);
    }

    onCropComplete(crop, pixelCrop){
        this.makeClientCrop(crop, pixelCrop);
    }

    async makeClientCrop(crop, pixelCrop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                pixelCrop,
                'newFile.jpeg',
            );
            this.setState({ croppedImageUrl });
        }
    }

    onImageLoaded(image, pixelCrop){
        this.imageRef = image;
        const { crop } = this.state;
        if (crop.aspect && crop.height && crop.width) {
          this.setState({
            crop: { ...crop, height: null },
          });
        } else {
          this.makeClientCrop(crop, pixelCrop);
        }
    }

    getCroppedImg(image, pixelCrop, fileName) {
        console.log(pixelCrop);
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise((resolve, reject) => {
            resolve(canvas.toDataURL());
        });
    }

    render(){
        return(
             <div className="modal fade" ref={modal => this.modal = modal} id="exampleModalLong" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <ReactCrop
                                src={this.props.originalImgURL}
                                crop={this.state.crop}
                                onChange={this.onCropChange}
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                              />
                        </div>

                        <div className="modal-footer">
                           <button type="button" className="btn btn-secondary" onClick={this.handleCloseClick}>Cancel Cropping</button>
                           <button type="button" className="btn btn-theme-color" onClick={this.cropImage}>Save Crop</button>
                         </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal
