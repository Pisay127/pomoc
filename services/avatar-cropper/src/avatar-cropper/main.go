package main

import (
	"github.com/streadway/amqp"

	"avatar-cropper/imgproc"

	log "gopkg.in/inconshreveable/log15.v2"
)

func main() {
	log := log.New("service", "avatar-cropper")

	log.Info("Connecting to RabbitMQ server...", "url", "amqp://guest:guest@localhost:5672/")
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Error("Unable to connect to RabbitMQ server.", "url", "amqp://guest:guest@localhost:5672/")
	}
	defer conn.Close()

	log.Info("Opening a RabbitMQ Channel...")
	ch, err := conn.Channel()
	if err != nil {
		log.Error("Failed to open a RabbitMQ channel.")
	}
	defer ch.Close()

	log.Info("Declaring a RabbitMQ queue...", "queue_name", "avatar_cropper_queue")
	q, err := ch.QueueDeclare(
		"avatar_cropper_queue", // name
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		log.Error("Failed to declare a RabbitMQ queue.", "queue_name", "avatar_cropper_queue")
	}

	log.Info("Setting RabbitMQ Qos for this worker...")
	err = ch.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	if err != nil {
		log.Error("Failed to set RabbitMQ Qos.")
	}

	log.Info("Getting RabbitMQ messages...")
	messages, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Error("Failed to register consumer. Sad.")
	}

	log.Info("Consuming images to crop...")
	for d := range messages {
		log.Info("Cropping newly uploaded image...", "image", string(d.Body))
		imgproc.CropImage(string(d.Body), string(d.Body))
		d.Ack(true)
	}
}
