import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SlotPicker from '../pages/SlotPicker.jsx'

test('test_TASK_BKG_04_reload_slots_when_package_changes', async () => {
  const loadSlots = vi.fn(({ packageCode }) =>
    Promise.resolve(
      packageCode === 'PREMIUM'
        ? [{ id: 'premium-1000', startTime: '10:00', remaining: 1 }]
        : [{ id: 'basic-0900', startTime: '09:00', remaining: 4 }],
    ),
  )

  render(<SlotPicker loadSlots={loadSlots} />)

  await waitFor(() => expect(screen.getByText('09:00 น.')).toBeTruthy())
  expect(screen.getByText('เหลือ 4 ที่นั่ง')).toBeTruthy()

  fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'PREMIUM' } })

  await waitFor(() => expect(screen.getByText('10:00 น.')).toBeTruthy())
  expect(screen.getByText('เหลือ 1 ที่นั่ง')).toBeTruthy()
  expect(loadSlots).toHaveBeenLastCalledWith(expect.objectContaining({ packageCode: 'PREMIUM' }))
})