import {atom, useRecoilValue, useSetRecoilState} from 'recoil'
import {Rectangle} from './components/Rectangle/Rectangle'
import {EditProperties} from './EditProperties'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'

// type ElementsContextType = {
//     elements: Element[]
//     addElement: () => void
//     setElement: SetElement
// }

// export const ElementsContext = createContext<ElementsContextType>({
//     elements: [],
//     addElement: () => {},
//     setElement: () => {},
// })

// type SelectedElementContextType = {
//     selectedElement: number | null
//     setSelectedElement: (index: number) => void
// }

// export const SelectedElementContext = createContext<SelectedElementContextType>({
//     selectedElement: null,
//     setSelectedElement: () => {},
// })

// export type SetElement = (indexToSet: number, newElement: Element) => void

export const selectedElementState = atom<number | null>({
    key: 'selectedElement',
    default: null,
})

export const elementsState = atom<number[]>({
    key: 'element',
    default: [],
})

function Canvas() {
    const setSelectedElement = useSetRecoilState(selectedElementState)
    const elements = useRecoilValue(elementsState)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            <EditProperties />
            {elements.map((id) => (
                <Rectangle key={id} id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas
