import React, { useState } from "react";

export default function Swipeable(props) {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);

  const minSwipeDistance = 50;

  function onTouchStart(e) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);

    setTouchEndY(null);
    setTouchStartY(e.targetTouches[0].clientY);
  }

  function onTouchMove(e) {
    const currentTouchX = e.targetTouches[0].clientX;
    const currentTouchY = e.targetTouches[0].clientY;

    const xDifference = Math.abs(touchStartX - currentTouchX);
    const yDifference = Math.abs(touchStartY - currentTouchY);

    // This checks if the touch movement is predominantly vertical (i.e., more likely a scroll than a swipe)
    if (yDifference > xDifference) {
      // Potentially allow default behavior (scroll) to proceed
      return; // Exiting early might allow the browser to handle the touch as a scroll
    }

    // Update touch end coordinates only if it's more of a swipe
    setTouchEndX(currentTouchX);
    setTouchEndY(currentTouchY);
  }

  function onTouchEnd() {
    if (touchStartX && touchEndX) swipeHorizontal();
    if (touchStartY && touchEndY) swipeVertical();
  }

  function swipeHorizontal() {
    const xDistance = touchStartX - touchEndX;
    const yDistance = touchStartY - touchEndY;
    if (Math.abs(yDistance) >= Math.abs(xDistance)) {
      return;
    }

    const isLeftSwipe = xDistance > minSwipeDistance;
    const isRightSwipe = xDistance < -minSwipeDistance;

    if (isLeftSwipe && props.onSwipeLeft) {
      props.onSwipeLeft();
    }

    if (isRightSwipe && props.onSwipeRight) {
      props.onSwipeRight();
    }
  }

  function swipeVertical() {
    const xDistance = touchStartX - touchEndX;
    const yDistance = touchStartY - touchEndY;
    if (Math.abs(xDistance) >= Math.abs(yDistance)) {
      return;
    }

    const isUpSwipe = yDistance > minSwipeDistance;
    const isDownSipe = yDistance < -minSwipeDistance;

    if (isDownSipe && props.onSwipeDown) {
      props.onSwipeDown();
    }

    if (isUpSwipe && props.onSwipeUp) {
      props.onSwipeUp();
    }
  }

  return React.createElement(
    "div",
    {
      onTouchStart: onTouchStart,
      onTouchMove: onTouchMove,
      onTouchEnd: onTouchEnd,
    },
    props.children
  );
}
