
type User = {
    name:string;
    lastname:string;
}

const greating = function(user:User):string {

    return `Hello ${user.name}${user.lastname}!`
}

export default greating;