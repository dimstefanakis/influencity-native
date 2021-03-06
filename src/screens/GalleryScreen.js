import React from 'react';
import Gallery from '../features/mediaGallery/Gallery2';

export default function GalleryScreen({route}) {
  const {images, videos} = route.params;
  return <Gallery images={images} videos={videos} />;
}
