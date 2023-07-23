import React from "react";

export default function getEventPageCoordinates(event: MouseEvent | TouchEvent) {
    let pageX = 0, pageY = 0;
    if (event instanceof MouseEvent) {
        pageX = event.pageX;
        pageY = event.pageY;
    }
    if (event instanceof TouchEvent) {
        pageX = event.touches[0].pageX;
        pageY = event.touches[0].pageY;
    }
    
    return { pageX, pageY };
}
