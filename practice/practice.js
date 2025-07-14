console.log('Before');
async function customerEmailProcess(){
    try
    {
        const customer = await getCustomer(15);
        
        if(customer.isGold){
            const movies = await getMovies(customer);

            console.log(movies);
            await sendEmail(customer);
        }
    }
    catch(err){
        console.log(err.message)
    }
}

customerEmailProcess();

function getCustomer(id){
    return new Promise((res, rej) =>{
        setTimeout(() => {
            res({ id: id, name: 'Luis Segura', isGold: true, email: 'email@email.com' })
        }, 2000);
    });
}

function getMovies(customer){
   return new Promise((res, rej) => {
        console.log('Top movies of: ' + customer.name)
        setTimeout(() => {
            res(['The Hobbit', 'LOTR']);
        }, 2000);
    })
}

function sendEmail(customer){
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log('Email sent to: ' + customer.email)
        }, 4000);
    })
}