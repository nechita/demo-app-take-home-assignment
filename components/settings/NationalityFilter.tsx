import { NATIONALITIES } from '@/utils/constants'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface NationalityFilterProps {
    selectedNationalities: string[]
    onToggle: (code: string) => void
}

export const NationalityFilter = ({ selectedNationalities, onToggle }: NationalityFilterProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Nationality Filter</CardTitle>
                <CardDescription>
                    {selectedNationalities.length
                        ? `Showing people from: ${selectedNationalities.join(', ')}`
                        : 'No nationality filter applied - showing people from all countries'}
                    .
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {NATIONALITIES.map((nationality) => (
                        <label
                            key={nationality.code}
                            className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 hover:bg-accent"
                        >
                            <Checkbox
                                checked={selectedNationalities.includes(nationality.code)}
                                onCheckedChange={() => onToggle(nationality.code)}
                            />
                            <span className="text-sm font-medium">
                                {nationality.name} ({nationality.code})
                            </span>
                        </label>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
