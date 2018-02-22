package main

import (
	"fmt"
	"log"

	"github.com/streadway/amqp"

	"avatar-cropper/imgproc"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatal("%s: %s", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

func main() {
	imgproc.CropImage("services/avatar-cropper/data/roma.jpg")
}

func mainTest() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"avatar_cropper_queue", // name
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	failOnError(err, "Failed to declare a queue")

	err = ch.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	)
	failOnError(err, "Failed to set Qos")

	messages, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan bool)
	go func() {
		for d := range messages {
			fmt.Printf("\nReceived a message: %s", d.Body)
			d.Ack(true)
		}
	}()

	fmt.Printf(" [*] Waiting for messages. To exit, press CTRL+C.")
	<-forever
}
