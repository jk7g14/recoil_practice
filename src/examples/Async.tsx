import {Container, Heading, Text} from '@chakra-ui/layout'
import {Select} from '@chakra-ui/select'
import {atom, atomFamily, useRecoilState, useRecoilValue, selector, selectorFamily, useSetRecoilState} from 'recoil'
import {Suspense, useState} from 'react'
import {getWeather} from './fakeAPI'

// const userIdState = atom<number | undefined>({
//     key: 'userId',
//     default: undefined,
// })

const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        // const userId = get(userIdState)
        // if (userId === undefined) return
        console.log(userId)
        console.log('00000000000000000000000000000000000000000000000')

        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json())
        return userData
    },
})

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
        async ({get}) => {
            // force refresh
            get(weatherRequestIdState(userId))
            const user = get(userState(userId))
            const weather = await getWeather(user.address.city)
            return weather
        },
})

const weatherRequestIdState = atomFamily({
    key: 'weatherRequestIdState',
    default: 0,
})

const useRefetchWeather = (userId: number) => {
    const setRequestId = useSetRecoilState(weatherRequestIdState(userId))

    return () => {
        setRequestId((id) => id + 1)
    }
}

const UserWeather = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    const weather = useRecoilValue(weatherState(userId))
    const refetch = useRefetchWeather(userId)
    return (
        <div>
            <Text>
                <b>Weather for {user.address.city}:</b> {weather}
            </Text>
            <Text onClick={refetch}>(refresh weather)</Text>
        </div>
    )
}

const UserData = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    // if (!user) return null

    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {user.name}
            </Text>
            <Text>
                <b>Phone:</b> {user.phone}
            </Text>
            <Suspense fallback={<div> loading weatherState...</div>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}

export const Async = () => {
    // const [userId, setUserId] = useRecoilState(userIdState)
    const [userId, setUserId] = useState<undefined | number>(undefined)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    console.log(value)
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </Select>
            {userId !== undefined && (
                <Suspense fallback={<div>laoding...</div>}>
                    <UserData userId={userId} />
                </Suspense>
            )}
        </Container>
    )
}
