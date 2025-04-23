import { Product } from '../types/product';

export const productData: Product[] = [
  {
    id: 'mic-1',
    name: 'ProAudio VM-100 Studio Condenser Microphone',
    category: 'Microphones',
    brand: 'ProAudio',
    price: 249.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    shortDescription: 'Professional large-diaphragm condenser microphone for studio recording with exceptional clarity and detail.',
    description: 'The ProAudio VM-100 is a professional large-diaphragm condenser microphone designed for studio recording. It features a 1-inch gold-sputtered diaphragm, cardioid polar pattern, and a smooth frequency response that captures every detail of your vocal or instrumental performances with exceptional clarity and warmth.',
    features: [
      'Large 1-inch gold-sputtered diaphragm',
      'Cardioid polar pattern for focused recording',
      '20Hz-20kHz frequency response',
      'Includes shock mount and carrying case',
      'Low self-noise and high SPL handling'
    ],
    specifications: [
      { name: 'Type', value: 'Condenser' },
      { name: 'Polar Pattern', value: 'Cardioid' },
      { name: 'Frequency Response', value: '20Hz-20kHz' },
      { name: 'Sensitivity', value: '-38dB (0dB=1V/Pa at 1kHz)' },
      { name: 'Output Impedance', value: '200 ohms' },
      { name: 'Self Noise', value: '16dB (A-weighted)' },
      { name: 'Maximum SPL', value: '132dB' },
      { name: 'Power Requirements', value: '48V phantom power' },
      { name: 'Connector', value: 'XLR 3-pin (male)' },
      { name: 'Dimensions', value: '50mm x 190mm' },
      { name: 'Weight', value: '460g' }
    ],
    dateAdded: '2025-04-10'
  },
  {
    id: 'headphones-1',
    name: 'SoundMaster Pro Studio Monitoring Headphones',
    category: 'Headphones',
    brand: 'SoundMaster',
    price: 179.99,
    discount: 10,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.6,
    reviews: 87,
    inStock: true,
    featured: true,
    shortDescription: 'Professional closed-back studio headphones with premium sound quality and comfort for extended mixing sessions.',
    description: 'The SoundMaster Pro Studio Monitoring Headphones deliver exceptional sound quality for professional audio production. With large 50mm drivers, closed-back design for excellent isolation, and plush memory foam ear cushions, these headphones provide accurate sound reproduction while ensuring comfort during long studio sessions.',
    features: [
      'Large 50mm neodymium drivers',
      'Closed-back design for excellent isolation',
      'Memory foam ear cushions for extended comfort',
      'Detachable 3m coiled cable',
      'Foldable design for easy storage and transport'
    ],
    specifications: [
      { name: 'Type', value: 'Over-ear, closed-back' },
      { name: 'Driver Size', value: '50mm' },
      { name: 'Frequency Response', value: '10Hz-30kHz' },
      { name: 'Impedance', value: '38 ohms' },
      { name: 'Sensitivity', value: '102dB' },
      { name: 'Maximum Input Power', value: '1600mW' },
      { name: 'Cable', value: 'Detachable 3m coiled cable with 3.5mm plug' },
      { name: 'Adapter', value: '¼" (6.3mm) screw-on adapter included' },
      { name: 'Weight', value: '320g' }
    ],
    dateAdded: '2025-03-22'
  },
  {
    id: 'interface-1',
    name: 'AudioFlow EVO-4 USB Audio Interface',
    category: 'Interfaces',
    brand: 'AudioFlow',
    price: 149.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/2918997/pexels-photo-2918997.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.7,
    reviews: 56,
    inStock: true,
    featured: false,
    shortDescription: 'Compact 2-in/2-out USB audio interface with high-quality preamps for home recording and podcasting.',
    description: 'The AudioFlow EVO-4 is a compact and easy-to-use USB audio interface designed for home recording, streaming, and podcasting. Featuring two high-quality preamps with 48V phantom power, direct monitoring, and a sleek design with intuitive controls, the EVO-4 delivers professional sound quality in a desktop-friendly package.',
    features: [
      '2 high-quality mic preamps with 48V phantom power',
      'USB-C connection for easy setup',
      'Direct monitoring with zero-latency',
      'Intuitive touch controls and LED level meters',
      'Compatible with Windows, Mac, and iOS devices'
    ],
    specifications: [
      { name: 'Inputs', value: '2 combo XLR/TRS' },
      { name: 'Outputs', value: '2 TRS line outputs' },
      { name: 'Headphone Output', value: '1 x ¼" stereo' },
      { name: 'Preamp Gain', value: '58dB' },
      { name: 'Frequency Response', value: '20Hz-20kHz (±0.1dB)' },
      { name: 'Dynamic Range', value: '113dB' },
      { name: 'Phantom Power', value: '48V' },
      { name: 'Bit Depth/Sample Rate', value: 'Up to 24-bit/96kHz' },
      { name: 'Connectivity', value: 'USB-C' },
      { name: 'Dimensions', value: '140mm x 100mm x 40mm' },
      { name: 'Weight', value: '380g' }
    ],
    dateAdded: '2025-04-05'
  },
  {
    id: 'mixer-1',
    name: 'MixMaster X12 Professional Mixing Console',
    category: 'Mixers',
    brand: 'MixMaster',
    price: 599.99,
    discount: 15,
    image: 'https://images.pexels.com/photos/159206/mixing-table-mixing-music-159206.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/159206/mixing-table-mixing-music-159206.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/159206/mixing-table-mixing-music-159206.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/4090902/pexels-photo-4090902.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/4088234/pexels-photo-4088234.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.9,
    reviews: 32,
    inStock: true,
    featured: true,
    shortDescription: 'Versatile 12-channel mixing console with premium preamps, built-in effects, and USB interface for studio and live sound.',
    description: 'The MixMaster X12 is a professional 12-channel mixing console designed for both studio and live applications. Featuring high-quality preamps, built-in effects, comprehensive EQ, and USB connectivity for multitrack recording, the X12 delivers exceptional sound quality and flexibility for demanding audio professionals.',
    features: [
      '8 mono channels with premium microphone preamps',
      '2 stereo channels for line-level devices',
      '3-band EQ with sweepable mids on each channel',
      'Built-in digital effects processor with 16 presets',
      'USB interface for multitrack recording and playback'
    ],
    specifications: [
      { name: 'Channels', value: '12 (8 mono + 2 stereo)' },
      { name: 'Mic Preamps', value: '8 with 48V phantom power' },
      { name: 'EQ', value: '3-band with sweepable mids' },
      { name: 'Aux Sends', value: '3 (2 pre/post switchable, 1 effects send)' },
      { name: 'Effects', value: '16 presets with parameter control' },
      { name: 'USB Interface', value: '12x12 I/O, 24-bit/48kHz' },
      { name: 'Main Outputs', value: 'XLR and ¼" TRS' },
      { name: 'Group Outputs', value: '4 (2 stereo pairs)' },
      { name: 'Dimensions', value: '440mm x 450mm x 100mm' },
      { name: 'Weight', value: '6.8kg' }
    ],
    dateAdded: '2025-02-18'
  },
  {
    id: 'mic-2',
    name: 'DynamicPro D78 Dynamic Microphone',
    category: 'Microphones',
    brand: 'DynamicPro',
    price: 129.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.5,
    reviews: 78,
    inStock: true,
    featured: false,
    shortDescription: 'Versatile dynamic microphone for vocals, instruments, and broadcast applications with rugged construction.',
    description: 'The DynamicPro D78 is a versatile dynamic microphone designed for a wide range of applications including vocals, instruments, and broadcast. With its cardioid pickup pattern, the D78 effectively rejects off-axis sound while providing warm, clear audio reproduction. Its rugged construction ensures reliable performance in demanding environments.',
    features: [
      'Dynamic capsule with cardioid polar pattern',
      'Frequency response tailored for vocals and instruments',
      'Internal shock mount to reduce handling noise',
      'Rugged metal construction',
      'On/off switch for convenient control'
    ],
    specifications: [
      { name: 'Type', value: 'Dynamic' },
      { name: 'Polar Pattern', value: 'Cardioid' },
      { name: 'Frequency Response', value: '50Hz-15kHz' },
      { name: 'Sensitivity', value: '-54dB (0dB=1V/Pa at 1kHz)' },
      { name: 'Output Impedance', value: '300 ohms' },
      { name: 'Connector', value: 'XLR 3-pin (male)' },
      { name: 'Dimensions', value: '48mm x 180mm' },
      { name: 'Weight', value: '330g' }
    ],
    dateAdded: '2025-03-12'
  },
  {
    id: 'headphones-2',
    name: 'AcousticFlow Wireless Studio Headphones',
    category: 'Headphones',
    brand: 'AcousticFlow',
    price: 249.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.7,
    reviews: 62,
    inStock: true,
    featured: true,
    shortDescription: 'Premium wireless studio headphones with aptX HD technology, long battery life, and exceptional sound quality.',
    description: 'The AcousticFlow Wireless Studio Headphones combine the convenience of wireless technology with professional studio sound quality. Featuring aptX HD technology for high-resolution audio transmission, 40mm custom-tuned drivers, and active noise cancellation, these headphones deliver an immersive listening experience. With up to 30 hours of battery life, they\'re perfect for long studio sessions or on-the-go listening.',
    features: [
      'Bluetooth 5.0 with aptX HD for high-resolution audio',
      'Active noise cancellation with ambient mode',
      'Custom-tuned 40mm drivers for accurate sound reproduction',
      'Up to 30 hours of battery life',
      'Included wired option with 3.5mm cable'
    ],
    specifications: [
      { name: 'Type', value: 'Over-ear, closed-back' },
      { name: 'Driver Size', value: '40mm' },
      { name: 'Frequency Response', value: '15Hz-22kHz' },
      { name: 'Impedance', value: '32 ohms' },
      { name: 'Sensitivity', value: '100dB' },
      { name: 'Bluetooth Version', value: '5.0 with aptX HD' },
      { name: 'Battery Life', value: 'Up to 30 hours (ANC on)' },
      { name: 'Charging', value: 'USB-C, fast charging (10min for 3hrs)' },
      { name: 'Weight', value: '285g' }
    ],
    dateAdded: '2025-04-02'
  },
  {
    id: 'camera-1',
    name: 'VisionPro X1 4K Video Camera',
    category: 'Cameras',
    brand: 'VisionPro',
    price: 899.99,
    discount: 10,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.8,
    reviews: 45,
    inStock: true,
    featured: true,
    shortDescription: 'Professional 4K video camera with advanced features for filmmakers, content creators, and video professionals.',
    description: 'The VisionPro X1 is a professional 4K video camera designed for filmmakers, content creators, and video professionals. With its large 1-inch sensor, 10-bit internal recording, and advanced autofocus system, the X1 delivers stunning image quality and versatile performance. The camera features a robust set of controls, multiple recording formats, and expandable connectivity options to meet the demands of professional video production.',
    features: [
      '1-inch CMOS sensor with 4K60p recording',
      '10-bit 4:2:2 internal recording',
      'Advanced phase-detection autofocus system',
      'Dual SD card slots with relay and simultaneous recording',
      'Professional XLR audio inputs with phantom power'
    ],
    specifications: [
      { name: 'Sensor', value: '1-inch CMOS' },
      { name: 'Resolution', value: '4K (3840x2160) up to 60fps' },
      { name: 'Recording Formats', value: 'H.264, H.265, ProRes (with optional upgrade)' },
      { name: 'Bit Depth/Color Sampling', value: '10-bit 4:2:2' },
      { name: 'Lens Mount', value: 'Interchangeable (M4/3)' },
      { name: 'Audio', value: '2x XLR inputs with 48V phantom power, 3.5mm mic input' },
      { name: 'Storage', value: 'Dual SD/SDHC/SDXC (UHS-II)' },
      { name: 'Battery', value: 'Rechargeable lithium-ion, approx. 3hrs recording' },
      { name: 'Dimensions', value: '160mm x 140mm x 110mm' },
      { name: 'Weight', value: '1.2kg (body only)' }
    ],
    dateAdded: '2025-03-15'
  },
  {
    id: 'interface-2',
    name: 'StudioLink Pro 8 Audio Interface',
    category: 'Interfaces',
    brand: 'StudioLink',
    price: 349.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/2918997/pexels-photo-2918997.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/2918997/pexels-photo-2918997.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/2918997/pexels-photo-2918997.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.6,
    reviews: 38,
    inStock: false,
    featured: false,
    shortDescription: 'Professional 8-in/8-out audio interface with high-quality preamps, extensive I/O, and low-latency performance.',
    description: 'The StudioLink Pro 8 is a professional 8-in/8-out audio interface designed for home studios and professional recording environments. With its high-quality preamps, extensive I/O options, and low-latency performance, the Pro 8 delivers exceptional sound quality and flexibility for recording, mixing, and production workflows. The interface features both USB and Thunderbolt connectivity, ensuring compatibility with a wide range of systems and providing future-proof performance.',
    features: [
      '8 high-quality mic preamps with 48V phantom power',
      '8 analog line outputs and ADAT optical expansion',
      'Thunderbolt and USB connectivity',
      'Low-latency direct monitoring with DSP effects',
      'Dedicated headphone outputs with independent mix control'
    ],
    specifications: [
      { name: 'Inputs', value: '8 combo XLR/TRS (mic/line/instrument)' },
      { name: 'Outputs', value: '8 TRS line outputs, ADAT optical (8-channel)' },
      { name: 'Headphone Outputs', value: '2 x ¼" stereo with independent control' },
      { name: 'Preamp Gain', value: '65dB' },
      { name: 'Frequency Response', value: '20Hz-20kHz (±0.1dB)' },
      { name: 'Dynamic Range', value: '120dB' },
      { name: 'Phantom Power', value: '48V (switchable in groups of 4)' },
      { name: 'Bit Depth/Sample Rate', value: 'Up to 24-bit/192kHz' },
      { name: 'Connectivity', value: 'Thunderbolt 3, USB-C (USB 3.1)' },
      { name: 'Dimensions', value: '483mm x 220mm x 44mm (1U rackmount)' },
      { name: 'Weight', value: '2.6kg' }
    ],
    dateAdded: '2025-02-28'
  },
  {
    id: 'accessory-1',
    name: 'SoundShield Pro Reflection Filter',
    category: 'Accessories',
    brand: 'SoundShield',
    price: 89.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3951630/pexels-photo-3951630.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3951855/pexels-photo-3951855.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.4,
    reviews: 52,
    inStock: true,
    featured: false,
    shortDescription: 'Professional vocal reflection filter for cleaner recordings in untreated rooms, with adjustable mounting system.',
    description: 'The SoundShield Pro Reflection Filter helps you achieve cleaner vocal recordings in untreated rooms. By absorbing and diffusing sound waves, it reduces unwanted room reflections and ambient noise from entering your microphone. The filter features a multi-layer acoustic design with a combination of absorption materials and diffusion panels for effective sound control. With its adjustable mounting system, the Pro Reflection Filter can be positioned precisely for optimal performance with various microphones and stands.',
    features: [
      'Multi-layer acoustic design for effective sound control',
      'Adjustable mounting system for precise positioning',
      'Compatible with most microphone stands',
      'Lightweight yet durable construction',
      'Foldable design for easy storage and transport'
    ],
    specifications: [
      { name: 'Dimensions', value: '34cm x 25cm x 15cm (open)' },
      { name: 'Weight', value: '1.8kg' },
      { name: 'Material', value: 'Multiple acoustic layers, metal frame' },
      { name: 'Mount', value: 'Adjustable bracket for standard mic stands' },
      { name: 'Carrying Case', value: 'Included' }
    ],
    dateAdded: '2025-03-20'
  },
  {
    id: 'mixer-2',
    name: 'CompactMix 8 Portable Mixer',
    category: 'Mixers',
    brand: 'CompactMix',
    price: 199.99,
    discount: 15,
    image: 'https://images.pexels.com/photos/4090902/pexels-photo-4090902.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/4090902/pexels-photo-4090902.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/4090902/pexels-photo-4090902.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/159206/mixing-table-mixing-music-159206.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/4088234/pexels-photo-4088234.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.3,
    reviews: 41,
    inStock: true,
    featured: false,
    shortDescription: 'Compact 8-channel mixer with built-in effects, perfect for small venues, podcasting, and mobile recording.',
    description: 'The CompactMix 8 is a portable 8-channel mixer designed for small venues, podcasting, and mobile recording applications. Despite its compact size, it includes essential features such as high-quality preamps, 3-band EQ, and a built-in digital effects processor. With its durable construction and intuitive layout, the CompactMix 8 offers reliable performance in a space-saving format that\'s easy to transport and set up.',
    features: [
      '4 mono channels with high-quality mic preamps',
      '2 stereo channels for line-level devices',
      '3-band EQ on each channel',
      'Built-in digital effects with 16 presets',
      'USB audio interface for recording and playback'
    ],
    specifications: [
      { name: 'Channels', value: '8 (4 mono + 2 stereo)' },
      { name: 'Mic Preamps', value: '4 with 48V phantom power' },
      { name: 'EQ', value: '3-band' },
      { name: 'Aux Sends', value: '1 FX send, 1 monitor send' },
      { name: 'Effects', value: '16 presets with parameter control' },
      { name: 'USB Interface', value: '2-in/2-out, 16-bit/48kHz' },
      { name: 'Main Outputs', value: 'XLR and ¼" TRS' },
      { name: 'Headphone Output', value: '¼" stereo' },
      { name: 'Dimensions', value: '260mm x 250mm x 70mm' },
      { name: 'Weight', value: '2.2kg' }
    ],
    dateAdded: '2025-03-25'
  },
  {
    id: 'camera-2',
    name: 'StreamCam Pro 4K Webcam',
    category: 'Cameras',
    brand: 'StreamCam',
    price: 149.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.5,
    reviews: 67,
    inStock: true,
    featured: false,
    shortDescription: 'Professional 4K webcam with AI-powered features, perfect for streamers, content creators, and remote professionals.',
    description: 'The StreamCam Pro 4K Webcam delivers exceptional video quality for streaming, content creation, and professional video conferencing. With its 4K sensor, HDR support, and AI-powered features like auto-framing and intelligent exposure, the StreamCam Pro ensures you look your best in any lighting situation. The camera includes dual noise-canceling microphones, a versatile mounting system, and advanced customization options through the companion software.',
    features: [
      '4K UHD resolution at 30fps (1080p at 60fps)',
      'AI-powered auto-framing and intelligent exposure',
      'HDR support for challenging lighting conditions',
      'Dual noise-canceling microphones',
      'Versatile mounting options with privacy cover'
    ],
    specifications: [
      { name: 'Resolution', value: '4K (3840x2160) at 30fps, 1080p at 60fps' },
      { name: 'Sensor', value: '1/2.8-inch CMOS' },
      { name: 'Field of View', value: '78° diagonal (adjustable)' },
      { name: 'Focus', value: 'Autofocus with 5x digital zoom' },
      { name: 'Microphones', value: 'Dual omnidirectional with noise cancellation' },
      { name: 'Connectivity', value: 'USB-C 3.2' },
      { name: 'Mount', value: 'Monitor mount, tripod thread (1/4")' },
      { name: 'Software', value: 'StreamCam Control Center (Windows/Mac)' },
      { name: 'Dimensions', value: '85mm x 58mm x 48mm' },
      { name: 'Weight', value: '156g' }
    ],
    dateAdded: '2025-04-01'
  },
  {
    id: 'accessory-2',
    name: 'ProStand Adjustable Microphone Boom Arm',
    category: 'Accessories',
    brand: 'ProStand',
    price: 69.99,
    discount: 0,
    image: 'https://images.pexels.com/photos/3951630/pexels-photo-3951630.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/3951630/pexels-photo-3951630.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/3951630/pexels-photo-3951630.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3951855/pexels-photo-3951855.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.6,
    reviews: 84,
    inStock: true,
    featured: false,
    shortDescription: 'Heavy-duty adjustable microphone boom arm with internal cable management and desk clamp mount.',
    description: 'The ProStand Adjustable Microphone Boom Arm provides stable and flexible positioning for your microphone during recording, podcasting, or streaming sessions. With its heavy-duty construction, smooth movement, and internal cable management, the boom arm offers professional performance and a clean, organized setup. The desk clamp mount ensures secure attachment to various desk thicknesses, while the standard 3/8" thread with 5/8" adapter accommodates most microphones and shock mounts.',
    features: [
      'Heavy-duty construction with smooth, silent movement',
      'Internal cable management for a clean setup',
      'Desk clamp mount with protective padding',
      'Standard 3/8" thread with 5/8" adapter',
      'Supports microphones and accessories up to 1.8kg'
    ],
    specifications: [
      { name: 'Material', value: 'Steel and aluminum construction' },
      { name: 'Arm Length', value: 'Total reach: 83cm extended' },
      { name: 'Mount', value: 'Desk clamp (fits desks up to 60mm thick)' },
      { name: 'Thread Size', value: '3/8" with 5/8" adapter included' },
      { name: 'Weight Capacity', value: '1.8kg' },
      { name: 'Cable Management', value: 'Internal channels' },
      { name: 'Product Weight', value: '1.3kg' }
    ],
    dateAdded: '2025-03-18'
  },
  {
    id: 'mic-3',
    name: 'UltraSound S1 Shotgun Microphone',
    category: 'Microphones',
    brand: 'UltraSound',
    price: 199.99,
    discount: 10,
    image: 'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageLarge: 'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1600',
    additionalImages: [
      'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    rating: 4.7,
    reviews: 37,
    inStock: true,
    featured: true,
    shortDescription: 'Compact shotgun microphone for video production with excellent off-axis rejection and natural sound reproduction.',
    description: 'The UltraSound S1 is a professional shotgun microphone designed for video production, field recording, and broadcast applications. With its super-cardioid polar pattern and precision-engineered acoustic design, the S1 delivers focused audio capture with excellent off-axis rejection and natural sound reproduction. The microphone features a durable, lightweight construction, low handling noise, and versatile mounting options for cameras and boom poles.',
    features: [
      'Super-cardioid polar pattern for focused audio capture',
      'Low self-noise and high sensitivity design',
      'Integrated shock mounting system',
      'Low-cut filter and -10dB pad switches',
      'Battery or phantom powered operation'
    ],
    specifications: [
      { name: 'Type', value: 'Condenser shotgun microphone' },
      { name: 'Polar Pattern', value: 'Super-cardioid/lobar' },
      { name: 'Frequency Response', value: '40Hz-20kHz' },
      { name: 'Sensitivity', value: '-32dB (0dB=1V/Pa at 1kHz)' },
      { name: 'Self Noise', value: '12dB (A-weighted)' },
      { name: 'Power Requirements', value: '48V phantom power or AA battery' },
      { name: 'Battery Life', value: 'Approx. 70 hours (alkaline)' },
      { name: 'Output', value: 'XLR 3-pin (male) and 3.5mm TRS' },
      { name: 'Dimensions', value: '21mm x 250mm' },
      { name: 'Weight', value: '178g (without battery)' }
    ],
    dateAdded: '2025-01-15'
  }
];