<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\ImageManager;

class uploadController extends Controller
{
    public function upload(Request $request){
        // var_dump($request->imageUpload);
        $manager = new ImageManager();
        $heroImage = $manager->make($request->imageUpload);
        $imageName = uniqid();
        $folder = 'images/uploads/heroImages';
        if( ! is_dir($folder)){
            mkdir($folder, 0777, true);
        }
        $heroImage->save($folder.'/'.$imageName.'.jpg', 100);

        $thumbFolder = 'images/uploads/thumbnails';
        if( ! is_dir($thumbFolder)){
            mkdir($thumbFolder, 0777, true);
        }
        $thumbnailImage = $manager->make($request->imageUpload);
        $thumbnailImage->resize(600, null, function($constraint){
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        $thumbnailImage->save($thumbFolder.'/'.$imageName.'.jpg', 100);

        return view('welcome');
    }

    public function store(Request $request){

        $manager = new ImageManager();
        $heroImage = $manager->make($request->file);
        $imageName = uniqid();
        $imageName = uniqid();
        $folder = 'images/uploads/heroImages';
        if( ! is_dir($folder)){
            mkdir($folder, 0777, true);
        }
        $heroImage->save($folder.'/'.$imageName.'.jpg', 100);

        $thumbFolder = 'images/uploads/thumbnails';
        if( ! is_dir($thumbFolder)){
            mkdir($thumbFolder, 0777, true);
        }
        $thumbnailImage = $manager->make($request->file);
        $thumbnailImage->resize(600, null, function($constraint){
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        $thumbnailImage->save($thumbFolder.'/'.$imageName.'.jpg', 100);

        return 'welcome';

    }

}
