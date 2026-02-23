'use client';
import { useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function InventarioPage() {
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setOpen(true);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Gestión de Inventario</CardTitle>
                        <CardDescription>Administra los productos y stock de la academia.</CardDescription>
                    </div>
                     <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4"/> Agregar Producto</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedProduct ? 'Editar' : 'Agregar'} Producto</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prod-name">Producto</Label>
                                    <Input id="prod-name" defaultValue={selectedProduct?.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prod-category">Categoría</Label>
                                    <Select defaultValue={selectedProduct?.category}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Uniforme">Uniforme</SelectItem>
                                            <SelectItem value="Accesorio">Accesorio</SelectItem>
                                            <SelectItem value="Bebida">Bebida</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="prod-stock">Stock</Label>
                                        <Input id="prod-stock" type="number" defaultValue={selectedProduct?.stock} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prod-price">Precio (S/)</Label>
                                        <Input id="prod-price" type="number" defaultValue={selectedProduct?.price} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Guardar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Imagen</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead><span className="sr-only">Acciones</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="aspect-square rounded-md object-cover" {...(product.imageHint && { 'data-ai-hint': product.imageHint })} />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>S/ {product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEdit(product)}>Editar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Deshabilitar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
