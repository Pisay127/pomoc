// Package utils implements utility functions used by the avatar-cropper service.
package utils

import "image"

func intAbs(value int) int {
	if value < 0 {
		return value * -1
	}

	return value
}

// GetRectArea calculates the area of an image.Rectangle.
func GetRectArea(rect image.Rectangle) int {
	return intAbs(rect.Max.X-rect.Min.X) * intAbs(rect.Max.Y-rect.Min.Y)
}
