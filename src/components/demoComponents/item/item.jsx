import React from 'react';
import { Box, Image } from 'gestalt';

const Item = () => {
  const [height, width, src, distance, origin_src] = [
    100,
    100,
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fdd502cc56049fca09420e7b77a786bc5c7a9b3ffb1371-l7vKt5_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638703199&t=3d356ab2db4431851731cbed874a1914',
    0.11111,
    '',
  ];

  return (
    <Box
      position="relative"
      className="ui-item"
      alignItems="center"
      // key={data.id}
      fit={true}
      padding={0}
    >
      <div draggable="true">
        <Image
          alt="Test"
          color="#fff"
          naturalHeight={height}
          naturalWidth={width}
          src={src}
        />

        {/* <div className="icon-mask"> */}
        {/* <span >
          <img src={blackSearch} alt="search-icon" />
        </span> */}
        {/* </div> */}
      </div>
      {/* {
        props.isSelected ?
          (
            <div className={classes.textWrapper}>
              <Typography variant="body1" className='title'>Similarity Metirc:&nbsp;&nbsp;</Typography>
              <Typography variant="h5" className='title'>{distance}</Typography>
            </div>
          ) : null
      } */}
    </Box>
  );
};
export default Item;
