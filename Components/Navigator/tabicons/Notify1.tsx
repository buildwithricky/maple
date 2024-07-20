import { View, Text } from 'react-native'
import React from 'react'
import { Exchange2Props } from './Props'
import { Path, Svg } from 'react-native-svg'

const Notify1: React.FC<Exchange2Props> = ({ width, height }) => {
  return (
        <Svg width={width} height={height} viewBox="0 0 21 20" fill="none">
            <Path d="M15.5 9C16.9587 9 18.3576 9.57946 19.3891 10.6109C20.4205 11.6424 21 13.0413 21 14.5C21 15.9587 20.4205 17.3576 19.3891 18.3891C18.3576 19.4205 16.9587 20 15.5 20C14.0413 20 12.6424 19.4205 11.6109 18.3891C10.5795 17.3576 10 15.9587 10 14.5C10 13.0413 10.5795 11.6424 11.6109 10.6109C12.6424 9.57946 14.0413 9 15.5 9ZM2.5 6.372V14.75C2.50004 15.1893 2.66533 15.6126 2.96305 15.9357C3.26076 16.2588 3.66912 16.4581 4.107 16.494L4.25 16.5H9.314C9.486 17.034 9.726 17.538 10.023 18.001L4.25 18C3.41986 18.0001 2.62117 17.6824 2.01777 17.1123C1.41437 16.5422 1.052 15.7628 1.005 14.934L1 14.75V6.372C1.48524 6.54382 2.01476 6.54382 2.5 6.372ZM16.5 17.002H14.5L14.507 17.118C14.5371 17.371 14.6626 17.603 14.858 17.7666C15.0533 17.9302 15.3037 18.013 15.5581 17.9982C15.8125 17.9834 16.0516 17.8721 16.2266 17.6869C16.4017 17.5018 16.4995 17.2568 16.5 17.002ZM15.503 11L15.336 11.007C14.399 11.092 13.666 11.771 13.527 12.642L13.509 12.797L13.503 13.001V14.294L12.647 15.148C12.5823 15.2127 12.5366 15.2939 12.5149 15.3828C12.4931 15.4717 12.4962 15.5648 12.5237 15.652C12.5513 15.7393 12.6022 15.8173 12.671 15.8776C12.7399 15.9379 12.8239 15.9782 12.914 15.994L13 16.002H18C18.0917 16.0022 18.1817 15.9772 18.2602 15.9298C18.3386 15.8823 18.4025 15.8141 18.4448 15.7328C18.4872 15.6514 18.5063 15.56 18.5002 15.4685C18.494 15.377 18.4628 15.289 18.41 15.214L18.354 15.148L17.505 14.299V12.947L17.5 12.8C17.423 11.788 16.556 11 15.503 11ZM10.807 10.003C10.381 10.447 10.017 10.953 9.731 11.503H6.748C6.55798 11.5029 6.37506 11.4308 6.23621 11.301C6.09736 11.1713 6.01293 10.9937 5.99997 10.8041C5.98702 10.6145 6.04651 10.4271 6.16643 10.2797C6.28635 10.1323 6.45775 10.0359 6.646 10.01L6.748 10.003H10.807ZM15.75 6.97518e-09C16.5801 -5.43467e-05 17.3788 0.317554 17.9822 0.887672C18.5856 1.45779 18.948 2.23719 18.995 3.066L19 3.25V9.022C18.5324 8.72262 18.0283 8.48467 17.5 8.314V3.25C17.5 2.81081 17.3348 2.38768 17.0373 2.06461C16.7398 1.74154 16.3317 1.54214 15.894 1.506L15.75 1.5H4.25C3.65 1.5 3.12 1.802 2.805 2.263C2.32063 2.00391 1.75779 1.93235 1.224 2.062C1.45159 1.48338 1.84025 0.9821 2.34393 0.617539C2.84762 0.252979 3.44523 0.040407 4.066 0.00500012L4.25 6.97518e-09H15.75ZM13.252 6.496C13.442 6.49606 13.6249 6.56824 13.7638 6.69797C13.9026 6.8277 13.9871 7.0053 14 7.19488C14.013 7.38446 13.9535 7.57189 13.8336 7.7193C13.7137 7.86671 13.5422 7.9631 13.354 7.989L13.252 7.996H6.748C6.55798 7.99594 6.37506 7.92376 6.23621 7.79403C6.09736 7.6643 6.01293 7.4867 5.99997 7.29712C5.98702 7.10754 6.04651 6.92011 6.16643 6.7727C6.28635 6.62529 6.45775 6.5289 6.646 6.503L6.748 6.496H13.252ZM1.75 3C2.08152 3 2.39946 3.1317 2.63388 3.36612C2.8683 3.60054 3 3.91848 3 4.25C3 4.58152 2.8683 4.89946 2.63388 5.13388C2.39946 5.3683 2.08152 5.5 1.75 5.5C1.41848 5.5 1.10054 5.3683 0.866117 5.13388C0.631696 4.89946 0.5 4.58152 0.5 4.25C0.5 3.91848 0.631696 3.60054 0.866117 3.36612C1.10054 3.1317 1.41848 3 1.75 3Z" fill="#494D55"/>
        </Svg>
  )
}

export default Notify1