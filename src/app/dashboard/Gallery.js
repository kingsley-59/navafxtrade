import React from 'react'
import { ref } from 'firebase/storage';
import { storage } from '../Firebase';

const Gallery = () => {
    const pathRef = ref(storage, );

  return (
    <div>
        <h2>Uploaded files.</h2>
    </div>
  )
}

export default Gallery