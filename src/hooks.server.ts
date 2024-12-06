import { connectDB } from "$db/mongo";

// Connect to MongoDB before starting the server
connectDB()
    .then((): void => {
        console.log('MongoDB started');
    })
    .catch((e) => {
        console.log('MongoDB failed to start');
        console.log(e);
    });


