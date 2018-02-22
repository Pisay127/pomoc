package imgproc

import (
	"fmt"
	"image"

	"gocv.io/x/gocv"

	"avatar-cropper/utils"
)

func loadClassifier() gocv.CascadeClassifier {
	classifier := gocv.NewCascadeClassifier()
	classifier.Load("services/avatar-cropper/data/haarcascade_frontalface_default.xml")

	return classifier
}

func getFaceRectangle(classifier gocv.CascadeClassifier, img gocv.Mat) image.Rectangle {
	rects := classifier.DetectMultiScale(img)

	var face image.Rectangle
	for _, r := range rects {
		if utils.GetRectArea(r) > utils.GetRectArea(face) {
			face = r
		}
	}

	return face
}

func expandFaceRectangle(faceRect *image.Rectangle, multiplier int) {
	rectWidth := faceRect.Max.X - faceRect.Min.X
	normalizedMultiplier := int(1.0 / (float64(multiplier) / 100.0))
	factor := int(rectWidth / normalizedMultiplier)

	fmt.Printf("faceRect dimensions: Min(%d, %d), Max(%d, %d)\n", faceRect.Min.X, faceRect.Min.Y,
		faceRect.Max.X, faceRect.Min.Y)
	fmt.Printf("Factor: %d\n", factor)
	fmt.Printf("Normalized multiplier: %d\n", normalizedMultiplier)

	faceRect.Min.X -= factor
	faceRect.Min.Y -= factor
	faceRect.Max.X += factor
	faceRect.Max.Y += factor
}

func getCroppedFace(img gocv.Mat, faceRect image.Rectangle) gocv.Mat {
	return img.Region(faceRect)
}

func getResizedFaceImage(face gocv.Mat, newSize int) gocv.Mat {
	var interpolationMethod gocv.InterpolationFlags

	if face.Cols() < newSize {
		// We're enlarging the image.
		interpolationMethod = gocv.InterpolationLanczos4
	} else {
		// We're shrinking the image.
		interpolationMethod = gocv.InterpolationArea
	}

	gocv.Resize(face, face, image.Point{newSize, newSize}, 0, 0, interpolationMethod)
	return face
}

// CropImage crops the passed image to only include the face.
func CropImage(imagePath string, target string) {
	img := gocv.IMRead(imagePath, gocv.IMReadColor)
	defer img.Close()

	classifier := loadClassifier()
	defer classifier.Close()

	face := getFaceRectangle(classifier, img)
	expandFaceRectangle(&face, 25)

	croppedFace := getResizedFaceImage(getCroppedFace(img, face), 800)

	// No need to compress the image for now.
	gocv.IMWrite(target, croppedFace)
}
