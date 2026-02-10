import React, { useState } from 'react'
import { useGetAllPigsQuery } from '../../redux/features/pigSlice'
import Container from '../../ui/Container'
import InputCustom from '../../ui/InputCustom'
import ButtonCustom from '../../ui/ButtonCustom'
import type { Pig } from '../../types/pigTypes'

const ByCategory = () => {
  const {data, isLoading, isFetching, isError} = useGetAllPigsQuery()

  const [myFilter, setMyFilter] = useState("")
  const [filteredData, setFilteredData] = useState<Pig[]>([])

  const selectCategory = () => {
    if(!data) return
    const fileredPigs = data?.filter(pig => pig.)
  }

  return (
    <Container>
      <div>
        <InputCustom type='text' value={myFilter} onChange={(e) => setMyFilter(e.target.value)} />
        <ButtonCustom type='button' onClick={selectCategory} />
      </div>
      
    </Container>
  )
}

export default ByCategory